import mongoose , { Schema } from 'mongoose';
import { User } from '../entities/userEntity'
import { hashPassword } from '../services/hashService'

const userSchema = new Schema<User>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    }
});


userSchema.pre('save', async function (next) { 
    const saltRounds: number = 12;
    const user = this;
    await hashPassword(user, saltRounds);
    next();
});

module.exports =  mongoose.model<User>('userModel', userSchema);