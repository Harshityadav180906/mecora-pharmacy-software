import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PharmacyProduct, PharmacyAudit } from '@/models/PharmacyModels';

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { pharmacyId, name, barcode, pack, batch, purchasePrice, price, stockQuantity, minAlertQuantity, quantityPerPack, gstPercentage, expiryDate, supplier, category } = body;

    if (!pharmacyId || !name || !price || !batch || !expiryDate) {
      return NextResponse.json({ success: false, message: 'Missing required product fields' }, { status: 400 });
    }

    const newProduct = await PharmacyProduct.create({
      pharmacyId,
      name,
      barcode: barcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      pack: pack || '10 tablets',
      batch,
      purchasePrice: Number(purchasePrice) || 0,
      price: Number(price),
      stockQuantity: Number(stockQuantity) || 0,
      minAlertQuantity: Number(minAlertQuantity) || 10,
      quantityPerPack: Number(quantityPerPack) || 10,
      gstPercentage: Number(gstPercentage) || 12,
      expiryDate,
      supplier: supplier || 'Wholesale Med Distributors',
      category: category || 'General Medicine',
    });

    // Add audit log
    await PharmacyAudit.create({
      pharmacyId,
      action: `ADDED PRODUCT: ${name} (Batch: ${batch}, Qty: ${stockQuantity})`,
      user: 'Harshit',
      role: 'ADMIN',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, stockQuantity, price } = body;

    const updated = await PharmacyProduct.findByIdAndUpdate(
      id,
      { ...(stockQuantity !== undefined && { stockQuantity: Number(stockQuantity) }), ...(price !== undefined && { price: Number(price) }) },
      { new: true }
    );

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });
    await PharmacyProduct.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
