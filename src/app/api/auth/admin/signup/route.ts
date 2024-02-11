import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { User } from '@/backend/models/User';
import connectDB from '@/backend/DB';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const salt = bcrypt.genSaltSync(10);
    const password = bcrypt.hashSync('Admin(26450)', salt);

    await User.create({
      email: 'admin@gmail.com',
      password: password,
      name: 'Admin',
      role: 'admin',
    });

    return NextResponse.json({
      status: 200,
      message: 'Admin created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { status: 400, message: 'Internal server error' },
      {
        status: 500,
      },
    );
  }
}
