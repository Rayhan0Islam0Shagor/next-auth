import { User } from '@/backend/models/User';
import { NextRequest, NextResponse } from 'next/server';
import Cryptr from 'cryptr';
import Env from '@/config/env';
import connectDB from '@/backend/DB';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const payload: ResetPasswordPayload = await request.json();
  await connectDB();

  // TODO: validate here to check both password are same or not
  if (payload.password !== payload.password_confirmation) {
  }

  const crypter = new Cryptr(Env.SECRET_KEY);
  const email = crypter.decrypt(payload.email);

  const user = await User.findOne({
    email,
    password_reset_token: payload.signature,
  });

  if (!user) {
    return NextResponse.json({
      status: 400,
      message: 'Reset url is not correct. pls double check it .',
    });
  }

  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(payload.password, salt);
  user.password_reset_token = null;
  await user.save();

  return NextResponse.json({
    status: 200,
    message: 'Password changed successfully. please login with new password.',
  });
}
