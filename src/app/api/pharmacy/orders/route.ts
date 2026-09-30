import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PharmacyOrder, PharmacyProduct, PharmacyAudit } from '@/models/PharmacyModels';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { pharmacyId, customerName, customerPhone, items, subtotal, gstAmount, discount, grandTotal, paymentMethod, cashierName } = body;

    if (!pharmacyId || !items || !items.length) {
      return NextResponse.json({ success: false, message: 'Invalid order data' }, { status: 400 });
    }

    // Generate Order Number
    const orderNumber = `M-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateString = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 1. Create the Order
    const order = await PharmacyOrder.create({
      pharmacyId,
      orderNumber,
      customerName: customerName || 'Counter Patient',
      customerPhone: customerPhone || '',
      items,
      subtotal,
      gstAmount: gstAmount || 0,
      discount: discount || 0,
      grandTotal,
      paymentMethod: paymentMethod || 'UPI',
      cashierName: cashierName || 'Harshit (Admin)',
      dateString,
    });

    // 2. Reduce stock for each item in that pharmacy
    for (const item of items) {
      if (item.productId) {
        await PharmacyProduct.findByIdAndUpdate(item.productId, {
          $inc: { stockQuantity: -item.quantity },
        });
      }
    }

    // 3. Add Audit Log
    await PharmacyAudit.create({
      pharmacyId,
      action: `ORDER PLACED: #${orderNumber} (₹${grandTotal}) via ${paymentMethod} for ${customerName || 'Counter Patient'}`,
      user: cashierName || 'Harshit',
      role: 'ADMIN',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
