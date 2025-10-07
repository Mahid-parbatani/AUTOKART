import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        if (!process.env.DATABASE_URL){
            throw new Error('DATABASE_URL environment variable is not defined');
        }
        await mongoose.connect(process.env.DATABASE_URL, {});
    } catch (error) {
        console.log(error);
    }
}
