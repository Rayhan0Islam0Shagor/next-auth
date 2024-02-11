import bcrypt from 'bcryptjs';
import connectDB from '@/backend/DB';
import ErrorReporter from '@/validator/ErrorReporter';
import { loginSchema } from '@/validator/authSchema';
import vine, { errors } from '@vinejs/vine';
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/backend/models/User';

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const body = await req.json();
    const validator = vine.compile(loginSchema);
    validator.errorReporter = () => new ErrorReporter();
    const output = await validator.validate(body);

    // check is email already exist
    const user = await User.findOne({ email: output.email });
    if (user) {
      const validatePassword = bcrypt.compareSync(
        output.password,
        user.password,
      );

      if (validatePassword) {
        return NextResponse.json(
          {
            status: 200,
            message: 'User logged in',
          },
          { status: 200 },
        );
      }

      return NextResponse.json(
        {
          status: 400,
          errors: {
            email: 'Please check your credentials.',
          },
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          status: 400,
          errors: {
            email: 'No account found with this email',
          },
        },
        { status: 200 },
      );
    }
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
