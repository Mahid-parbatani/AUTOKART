import mongoose, { Schema } from 'mongoose';
import { BlacklistedUser } from '../entities/blackbookEntity';

const blacklistedUserSchema = new Schema<BlacklistedUser>({
    userId: { 
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    reason: {
        type: String,
        required: true
    },
    blacklistedBy: {
        type: String,
        required: true
    },
    blacklistedAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

// Index for efficient queries
blacklistedUserSchema.index({ userId: 1 });
blacklistedUserSchema.index({ email: 1 });
blacklistedUserSchema.index({ isActive: 1, expiresAt: 1 });

module.exports = mongoose.model<BlacklistedUser>('BlacklistedUser', blacklistedUserSchema);