import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { SoftwareUser, Pharmacy, PharmacyAudit } from '@/models/PharmacyModels';

// Seed default users if database is fresh
const defaultUsers = [
  {
    name: 'Harshit Yadav (Super Admin)',
    email: 'admin@mecora.com',
    password: 'admin123',
    role: 'SUPER_ADMIN',
    pharmacyId: 'xyz',
    pharmacyName: 'Mecora Master Network',
    phone: '+91 98100 00000',
  },
  {
    name: 'Harshit (XYZ Owner)',
    email: 'xyz@pharmacy.com',
    password: 'admin123',
    role: 'PHARMACY_OWNER',
    pharmacyId: 'xyz',
    pharmacyName: 'XYZ Pharmacy & Healthcare',
    phone: '+91 98115 15515',
  },
  {
    name: 'Dr. Rakesh Verma (ZYX Owner)',
    email: 'zyx@pharmacy.com',
    password: 'admin123',
    role: 'PHARMACY_OWNER',
    pharmacyId: 'zyx',
    pharmacyName: 'ZYX Medicos & Wellness',
    phone: '+91 98765 43210',
  },
  {
    name: 'Rohit Sharma (Cashier)',
    email: 'rohit@xyz.com',
    password: '123456',
    role: 'EMPLOYEE',
    pharmacyId: 'xyz',
    pharmacyName: 'XYZ Pharmacy & Healthcare',
    employeeCode: 'EMP-101',
    phone: '+91 98111 22233',
  },
  {
    name: 'Priya Patel (Pharmacist)',
    email: 'priya@zyx.com',
    password: '123456',
    role: 'EMPLOYEE',
    pharmacyId: 'zyx',
    pharmacyName: 'ZYX Medicos & Wellness',
    employeeCode: 'EMP-202',
    phone: '+91 98222 33344',
  },
];

export async function POST(req: Request) {
  try {
    await connectDB();

    // Ensure default users are seeded
    const count = await SoftwareUser.countDocuments();
    if (count === 0) {
      for (const u of defaultUsers) {
        await SoftwareUser.create(u);
      }
    }

    const { email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required' }, { status: 400 });
    }

    // Lookup user in MongoDB Compass
    let user = await SoftwareUser.findOne({ email: email.toLowerCase().trim() });

    // If not found in SoftwareUser, also check if added under PharmacyStaff
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid credentials. User not found in database.' }, { status: 401 });
    }

    if (user.password !== password) {
      return NextResponse.json({ success: false, message: 'Invalid password. Please check and try again.' }, { status: 401 });
    }

    // Find pharmacy branch info
    let pharmacy = null;
    if (user.pharmacyId) {
      pharmacy = await Pharmacy.findOne({ pharmacyId: user.pharmacyId });
    }

    // Add Audit Log in MongoDB
    await PharmacyAudit.create({
      pharmacyId: user.pharmacyId || 'global',
      action: `USER LOGGED IN: ${user.name} (${user.role}) from database`,
      user: user.name,
      role: user.role,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        pharmacyId: user.pharmacyId,
        pharmacyName: user.pharmacyName || pharmacy?.name || 'Mecora Pharmacy',
        employeeCode: user.employeeCode,
        phone: user.phone,
      },
      pharmacy,
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
