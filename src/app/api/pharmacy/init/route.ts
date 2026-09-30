import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Pharmacy, PharmacyProduct, PharmacyOrder, PharmacyStaff, PharmacyAudit } from '@/models/PharmacyModels';

const initialPharmacies = [
  {
    pharmacyId: 'xyz',
    name: 'XYZ Pharmacy & Healthcare',
    ownerEmail: 'xyz@pharmacy.com',
    phone: '+91 98115 15515',
    address: 'Shop 12, Health Enclave, Mumbai',
    drugLicenseNo: 'MH-MZ2-2026-0988',
    gstin: '27AABCT1332F1Z4',
  },
  {
    pharmacyId: 'zyx',
    name: 'ZYX Medicos & Wellness',
    ownerEmail: 'zyx@pharmacy.com',
    phone: '+91 98765 43210',
    address: 'Plot 45, Sector 18, Jaipur',
    drugLicenseNo: 'RJ-JP-2026-4431',
    gstin: '08AAACZ5541L1Z9',
  }
];

const sampleProductsXYZ = [
  { name: 'Pantoprazole 40mg (Pan 40)', barcode: '8901148210012', pack: '15 tablets', batch: 'PAN-9921', purchasePrice: 95, price: 152, stockQuantity: 45, minAlertQuantity: 10, quantityPerPack: 15, gstPercentage: 12, expiryDate: '2027-11-30', category: 'Gastroenterology', supplier: 'Alkem Labs' },
  { name: 'Cefixime 200mg (Taxim-O)', barcode: '8901148210029', pack: '10 tablets', batch: 'TXM-4401', purchasePrice: 120, price: 182, stockQuantity: 32, minAlertQuantity: 8, quantityPerPack: 10, gstPercentage: 12, expiryDate: '2027-08-15', category: 'Antibiotics', supplier: 'Cipla Ltd' },
  { name: 'Doxycycline 100mg (Dox-100)', barcode: '8901148210036', pack: '10 capsules', batch: 'DOX-2023', purchasePrice: 65, price: 95, stockQuantity: 28, minAlertQuantity: 10, quantityPerPack: 10, gstPercentage: 12, expiryDate: '2028-01-20', category: 'Antibiotics', supplier: 'Mankind Pharma' },
  { name: 'Metronidazole 400mg (Flagyl)', barcode: '8901148210043', pack: '15 tablets', batch: 'FLG-1102', purchasePrice: 35, price: 56, stockQuantity: 60, minAlertQuantity: 15, quantityPerPack: 15, gstPercentage: 12, expiryDate: '2027-05-10', category: 'Antibiotics', supplier: 'Abbott Healthcare' },
  { name: 'Ciprofloxacin 500mg (Ciplox)', barcode: '8901148210050', pack: '10 tablets', batch: 'CPX-8831', purchasePrice: 110, price: 158, stockQuantity: 5, minAlertQuantity: 10, quantityPerPack: 10, gstPercentage: 12, expiryDate: '2027-03-31', category: 'Antibiotics', supplier: 'Cipla Ltd' },
  { name: 'Ibuprofen 400mg (Brufen)', barcode: '8901148210067', pack: '15 tablets', batch: 'BRF-7019', purchasePrice: 20, price: 38, stockQuantity: 5, minAlertQuantity: 15, quantityPerPack: 15, gstPercentage: 12, expiryDate: '2026-11-20', category: 'Pain Relief', supplier: 'Abbott Healthcare' },
];

const sampleProductsZYX = [
  { name: 'Amoxicillin 500mg (Mox 500)', barcode: '8901148210074', pack: '10 capsules', batch: 'MOX-1120', purchasePrice: 75, price: 112, stockQuantity: 55, minAlertQuantity: 10, quantityPerPack: 10, gstPercentage: 12, expiryDate: '2027-10-15', category: 'Antibiotics', supplier: 'Sun Pharma' },
  { name: 'Azithromycin 500mg (Azee 500)', barcode: '8901148210081', pack: '5 tablets', batch: 'AZ-9901', purchasePrice: 105, price: 158, stockQuantity: 40, minAlertQuantity: 8, quantityPerPack: 5, gstPercentage: 12, expiryDate: '2028-02-28', category: 'Antibiotics', supplier: 'Cipla Ltd' },
  { name: 'Paracetamol 650mg (Dolo 650)', barcode: '8901148210098', pack: '15 tablets', batch: 'DLO-3304', purchasePrice: 22, price: 34, stockQuantity: 120, minAlertQuantity: 20, quantityPerPack: 15, gstPercentage: 12, expiryDate: '2028-06-30', category: 'Antipyretics', supplier: 'Micro Labs' },
  { name: 'Montelukast + Levocetirizine (Montair-LC)', barcode: '8901148210104', pack: '10 tablets', batch: 'MNT-4412', purchasePrice: 140, price: 210, stockQuantity: 18, minAlertQuantity: 10, quantityPerPack: 10, gstPercentage: 12, expiryDate: '2027-09-15', category: 'Respiratory', supplier: 'Cipla Ltd' },
  { name: 'Telmisartan 40mg (Telma 40)', barcode: '8901148210111', pack: '30 tablets', batch: 'TLM-8890', purchasePrice: 180, price: 265, stockQuantity: 6, minAlertQuantity: 12, quantityPerPack: 30, gstPercentage: 12, expiryDate: '2026-12-31', category: 'Cardiology', supplier: 'Glenmark' },
];

export async function GET() {
  try {
    await connectDB();

    // Check if pharmacies exist, seed if not
    const count = await Pharmacy.countDocuments();
    if (count === 0) {
      console.log('Seeding initial pharmacies and multi-tenant inventory...');
      for (const p of initialPharmacies) {
        await Pharmacy.create(p);
      }

      // Seed XYZ products
      for (const prod of sampleProductsXYZ) {
        await PharmacyProduct.create({ ...prod, pharmacyId: 'xyz' });
      }

      // Seed ZYX products
      for (const prod of sampleProductsZYX) {
        await PharmacyProduct.create({ ...prod, pharmacyId: 'zyx' });
      }

      // Seed XYZ Sample Order
      await PharmacyOrder.create({
        pharmacyId: 'xyz',
        orderNumber: 'M-4206',
        customerName: 'Mohit Verma',
        customerPhone: '9811515515',
        items: [{ name: 'Pantoprazole 40mg (Pan 40)', batch: 'PAN-9921', quantity: 1, price: 152, total: 152 }],
        subtotal: 152,
        grandTotal: 152,
        paymentMethod: 'UPI',
        dateString: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });

      // Seed ZYX Sample Order
      await PharmacyOrder.create({
        pharmacyId: 'zyx',
        orderNumber: 'Z-1001',
        customerName: 'Rahul Sharma',
        customerPhone: '9876543210',
        items: [{ name: 'Amoxicillin 500mg (Mox 500)', batch: 'MOX-1120', quantity: 1, price: 112, total: 112 }],
        subtotal: 112,
        grandTotal: 112,
        paymentMethod: 'Cash',
        dateString: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      });
    }

    const pharmacies = await Pharmacy.find().sort({ createdAt: 1 });
    return NextResponse.json({ success: true, pharmacies });
  } catch (error: any) {
    console.error('Init error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
