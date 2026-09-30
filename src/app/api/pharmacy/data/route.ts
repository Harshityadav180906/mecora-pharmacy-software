import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Pharmacy, PharmacyProduct, PharmacyOrder, PharmacyStaff, PharmacyAudit } from '@/models/PharmacyModels';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const pharmacyId = searchParams.get('pharmacyId') || 'xyz';

    const pharmacy = await Pharmacy.findOne({ pharmacyId });
    const products = await PharmacyProduct.find({ pharmacyId }).sort({ createdAt: -1 });
    const orders = await PharmacyOrder.find({ pharmacyId }).sort({ createdAt: -1 });
    const staff = await PharmacyStaff.find({ pharmacyId }).sort({ createdAt: -1 });
    const audits = await PharmacyAudit.find({ pharmacyId }).sort({ createdAt: -1 }).limit(10);

    // Calculate live analytics
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stockQuantity <= p.minAlertQuantity).length;
    
    // Expiring within 60 days
    const now = new Date();
    const sixtyDaysLater = new Date();
    sixtyDaysLater.setDate(now.getDate() + 60);

    const expiringSoonCount = products.filter(p => {
      if (!p.expiryDate) return false;
      const exp = new Date(p.expiryDate);
      return exp >= now && exp <= sixtyDaysLater;
    }).length;

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const cashCollection = orders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const upiCollection = orders.filter(o => o.paymentMethod === 'UPI').reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const cardCollection = orders.filter(o => o.paymentMethod === 'Card').reduce((sum, o) => sum + (o.grandTotal || 0), 0);

    return NextResponse.json({
      success: true,
      pharmacy,
      products,
      orders,
      staff,
      audits,
      stats: {
        totalProducts,
        lowStockCount,
        expiringSoonCount,
        totalOrders,
        totalRevenue,
        cashCollection,
        upiCollection,
        cardCollection,
      }
    });
  } catch (error: any) {
    console.error('Fetch data error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
