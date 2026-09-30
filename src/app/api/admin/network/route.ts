import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Pharmacy, PharmacyProduct, PharmacyOrder, SoftwareUser, PharmacyAudit } from '@/models/PharmacyModels';

export async function GET() {
  try {
    await connectDB();

    const pharmacies = await Pharmacy.find().sort({ createdAt: 1 });
    const users = await SoftwareUser.find().select('-password').sort({ createdAt: -1 });
    const allOrders = await PharmacyOrder.find().sort({ createdAt: -1 });
    const allProducts = await PharmacyProduct.find();
    const globalAudits = await PharmacyAudit.find().sort({ createdAt: -1 }).limit(20);

    const totalRevenue = allOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const totalOrdersCount = allOrders.length;
    const totalProductsCount = allProducts.length;

    const pharmacySummaries = await Promise.all(
      pharmacies.map(async (p) => {
        const branchOrders = allOrders.filter(o => o.pharmacyId === p.pharmacyId);
        const branchProducts = allProducts.filter(pr => pr.pharmacyId === p.pharmacyId);
        const branchRevenue = branchOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
        return {
          pharmacyId: p.pharmacyId,
          name: p.name,
          ownerEmail: p.ownerEmail,
          phone: p.phone,
          address: p.address,
          drugLicenseNo: p.drugLicenseNo,
          gstin: p.gstin,
          status: p.status || 'Active',
          totalProducts: branchProducts.length,
          totalOrders: branchOrders.length,
          revenue: branchRevenue,
        };
      })
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalPharmacies: pharmacies.length,
        totalRevenue,
        totalOrdersCount,
        totalProductsCount,
        totalUsers: users.length,
      },
      pharmacySummaries,
      users,
      globalAudits,
    });
  } catch (error: any) {
    console.error('Super Admin network API error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
