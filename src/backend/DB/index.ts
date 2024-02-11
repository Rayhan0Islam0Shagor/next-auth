import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log('Already connected.');
      return true;
    }

    await mongoose
      .connect(process.env.MONGO_URL! as string)
      .then(() => {
        console.log('Connected to MongoDB');
      })
      .catch((error) => {
        console.log(error);
      });
    return true;
  } catch (error) {
    console.log('🚀 ~ file: mongodb.js:19 ~ connectDB ~ error:', error);
  }
};

export default connectDB;
