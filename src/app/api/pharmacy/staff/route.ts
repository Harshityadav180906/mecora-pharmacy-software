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

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, name, email, password, role, phone } = body;

    if (!id || !email) {
      return NextResponse.json({ success: false, message: 'ID and email are required' }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const updateData: any = { name, email: cleanEmail, role, phone };
    if (password && password.trim()) {
      updateData.password = password.trim();
    }

    const updatedStaff = await PharmacyStaff.findByIdAndUpdate(id, updateData, { new: true });
    
    // Also update SoftwareUser
    await SoftwareUser.findOneAndUpdate({ email: cleanEmail }, {
      name,
      email: cleanEmail,
      ...(password && password.trim() ? { password: password.trim() } : {}),
      phone: phone || '',
    });

    await PharmacyAudit.create({
      pharmacyId: updatedStaff?.pharmacyId || 'xyz',
      action: `UPDATED EMPLOYEE: ${name}`,
      user: 'Owner / Admin',
      role: 'SUPER ADMIN',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });

    return NextResponse.json({ success: true, staff: updatedStaff });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id && !email) {
      return NextResponse.json({ success: false, message: 'Staff ID or email required' }, { status: 400 });
    }

    let staff = null;
    if (id) {
      staff = await PharmacyStaff.findByIdAndDelete(id);
    } else if (email) {
      staff = await PharmacyStaff.findOneAndDelete({ email: email.toLowerCase().trim() });
    }

    if (email || staff?.email) {
      const cleanEmail = (email || staff?.email).toLowerCase().trim();
      await SoftwareUser.findOneAndDelete({ email: cleanEmail });
    }

    await PharmacyAudit.create({
      pharmacyId: staff?.pharmacyId || 'xyz',
      action: `REMOVED EMPLOYEE: ${staff?.name || email}`,
      user: 'Owner / Admin',
      role: 'SUPER ADMIN',
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });

    return NextResponse.json({ success: true, message: 'Employee account deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

