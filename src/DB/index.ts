import mongoose from 'mongoose';

export function connectDB() {
  mongoose
    .connect(process.env.MONGO_URL!, {
      tls: true,
      ssl: true,
    })
    .then(() => console.log('Database connected successfully'))
    .catch((err: typeof Error) => console.log('The DB error is', err));
}
