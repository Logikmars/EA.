import mongoose from 'mongoose';

export async function connectDatabase() {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        throw new Error('MONGO_URI is not set in the backend environment.');
    }

    await mongoose.connect(mongoUri);
}
