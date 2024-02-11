import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      required: [true, 'Name is required'],
      type: Schema.Types.String,
    },
    email: {
      required: [true, 'Email is required'],
      type: Schema.Types.String,
      unique: true,
      trim: true,
    },
    password: {
      required: false,
      type: Schema.Types.String,
    },
    avatar: {
      required: false,
      type: Schema.Types.String,
    },
    role: {
      required: false,
      type: Schema.Types.String,
      default: 'user',
      enum: ['user', 'admin'],
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
