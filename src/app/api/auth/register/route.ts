import connectDB from '@/backend/DB';
import ErrorReporter from '@/validator/ErrorReporter';
import { registerSchema } from '@/validator/authSchema';
import vine, { errors } from '@vinejs/vine';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { User } from '@/backend/models/User';

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();
    const validator = vine.compile(registerSchema);
    validator.errorReporter = () => new ErrorReporter();
    const output = await validator.validate(body);

    // check is email already exist
    const existingUser = await User.findOne({ email: output.email });

    if (existingUser) {
      NextResponse.json(
        {
          status: 400,
          errors: {
            email: 'Email is already taken',
          },
        },
        { status: 200 },
      );
      return;
    }

    // encrypt password
    const salt = bcrypt.genSaltSync(10);
    output.password = bcrypt.hashSync(output.password, salt);
    await User.create(output);

    return NextResponse.json(
      {
        status: 200,
        message: 'User registered successfully',
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      console.log('🚀 ~ POST ~ error:', error);
      return NextResponse.json(
        { status: 400, errors: error.message },
        {
          status: 500,
        },
      );
    }
  }
};
