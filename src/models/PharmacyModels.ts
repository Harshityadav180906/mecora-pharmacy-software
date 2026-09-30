import mongoose, { Schema } from 'mongoose';

// Software User Schema for Authentication from MongoDB
const softwareUserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['SUPER_ADMIN', 'PHARMACY_OWNER', 'EMPLOYEE'], required: true },
  pharmacyId: { type: String, default: '' }, // Scoped pharmacy branch
  pharmacyName: { type: String, default: '' },
  employeeCode: { type: String, default: '' },
  phone: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// Pharmacy Branch Profile Schema
const pharmacySchema = new Schema({
  pharmacyId: { type: String, required: true, unique: true }, // e.g. 'xyz', 'zyx'
  name: { type: String, required: true }, // e.g. 'XYZ Pharmacy & Healthcare'
  ownerEmail: { type: String, required: true },
  phone: { type: String, default: '+91 98765 43210' },
  address: { type: String, default: 'Medical Enclave, Central Market' },
  drugLicenseNo: { type: String, default: 'DL-2026-MED-8899' },
  gstin: { type: String, default: '07AAAAA0000A1Z5' },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
}, { timestamps: true });

// Pharmacy Product Schema (Isolated per Pharmacy with AI Medicine Intelligence)
const pharmacyProductSchema = new Schema({
  pharmacyId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  barcode: { type: String, default: '' },
  pack: { type: String, default: '10 tablets' },
  batch: { type: String, required: true },
  purchasePrice: { type: Number, default: 0 },
  price: { type: Number, required: true }, // selling price
  stockQuantity: { type: Number, required: true, default: 0 },
  minAlertQuantity: { type: Number, default: 10 },
  quantityPerPack: { type: Number, default: 10 },
  gstPercentage: { type: Number, default: 12 },
  expiryDate: { type: String, required: true },
  supplier: { type: String, default: 'Medica Wholesale Corp' },
  category: { type: String, default: 'General Medicine' },
  salt: { type: String, default: '' },
  uses: { type: String, default: '' },
  dosageInstructions: { type: String, default: 'As directed by physician' },
  sideEffects: { type: String, default: 'Mild dizziness or dry mouth in rare cases' },
}, { timestamps: true });

// Pharmacy Order Schema (Isolated per Pharmacy with Employee attribution)
const pharmacyOrderSchema = new Schema({
  pharmacyId: { type: String, required: true, index: true },
  orderNumber: { type: String, required: true }, // e.g. 'M-4206'
  customerName: { type: String, default: 'Counter Patient' },
  customerPhone: { type: String, default: '' },
  items: [{
    productId: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    batch: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true },
  }],
  subtotal: { type: Number, required: true },
  gstAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  cashGiven: { type: Number, default: 0 },
  cashChange: { type: Number, default: 0 },
  paymentMethod: { type: String, enum: ['UPI', 'Cash', 'Card'], default: 'UPI' },
  cashierName: { type: String, default: 'Harshit' },
  cashierId: { type: String, default: 'owner' },
  dateString: { type: String },
}, { timestamps: true });

// Pharmacy Staff Schema
const pharmacyStaffSchema = new Schema({
  pharmacyId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, default: '123456' },
  employeeCode: { type: String, default: 'EMP-101' },
  role: { type: String, enum: ['Admin', 'Pharmacist', 'Cashier', 'Billing Staff'], default: 'Billing Staff' },
  phone: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

// Audit Log Schema
const pharmacyAuditSchema = new Schema({
  pharmacyId: { type: String, required: true, index: true },
  action: { type: String, required: true },
  user: { type: String, default: 'Admin' },
  role: { type: String, default: 'ADMIN' },
  details: { type: String, default: '' },
  timestamp: { type: String },
}, { timestamps: true });

export const SoftwareUser = mongoose.models.SoftwareUser || mongoose.model('SoftwareUser', softwareUserSchema);
export const Pharmacy = mongoose.models.Pharmacy || mongoose.model('Pharmacy', pharmacySchema);
export const PharmacyProduct = mongoose.models.PharmacyProduct || mongoose.model('PharmacyProduct', pharmacyProductSchema);
export const PharmacyOrder = mongoose.models.PharmacyOrder || mongoose.model('PharmacyOrder', pharmacyOrderSchema);
export const PharmacyStaff = mongoose.models.PharmacyStaff || mongoose.model('PharmacyStaff', pharmacyStaffSchema);
export const PharmacyAudit = mongoose.models.PharmacyAudit || mongoose.model('PharmacyAudit', pharmacyAuditSchema);
