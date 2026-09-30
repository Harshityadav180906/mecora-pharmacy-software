import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { PharmacyStaff, SoftwareUser, PharmacyAudit } from '@/models/PharmacyModels';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const pharmacyId = searchParams.get('pharmacyId') || 'xyz';
    const staff = await PharmacyStaff.find({ pharmacyId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, staff });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { pharmacyId, name, email, password, role, phone, employeeCode } = body;

    if (!pharmacyId || !name || !email) {
      return NextResponse.json({ success: false, message: 'Name and email are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userPassword = password && password.trim() ? password.trim() : '123456';
    const code = employeeCode || `EMP-${Math.floor(100 + Math.random() * 900)}`;

    // 1. Create or update PharmacyStaff document
    const newStaff = await PharmacyStaff.findOneAndUpdate(
      { email: cleanEmail, pharmacyId },
      {
        pharmacyId,
        name,
        email: cleanEmail,
        password: userPassword,
        role: role || 'Billing Staff',
        phone: phone || '',
        employeeCode: code,
        active: true,
      },
      { upsert: true, new: true }
    );

    // 2. Sync into SoftwareUser collection for login authentication
    await SoftwareUser.findOneAndUpdate(
      { email: cleanEmail },
      {
        name,
        email: cleanEmail,
        password: userPassword,
        role: 'EMPLOYEE',
        pharmacyId,
        pharmacyName: pharmacyId === 'zyx' ? 'ZYX Medicos & Wellness' : 'XYZ Pharmacy & Healthcare',
        employeeCode: code,
        phone: phone || '',
        active: true,
      },
      { upsert: true, new: true }
    );

    await PharmacyAudit.create({
      pharmacyId,
      action: `ADDED EMPLOYEE: ${name} (${role})`,
      user: 'Harshit (Owner)',
      role: 'SUPER ADMIN',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });

    return NextResponse.json({ success: true, staff: newStaff });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
