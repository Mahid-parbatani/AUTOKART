import mongoose, { Schema } from 'mongoose';
import { BlacklistedToken } from '../entities/blackbookEntity'

const blacklistedTokenSchema = new Schema<BlacklistedToken>({
    token: { 
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        default: null
    },
    reason: {
        type: String,
        required: true,
        default: 'User logout'
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
blacklistedTokenSchema.index({ token: 1 });
blacklistedTokenSchema.index({ userId: 1 });
blacklistedTokenSchema.index({ isActive: 1, expiresAt: 1 });

module.exports = mongoose.model<BlacklistedToken>('BlacklistedToken', blacklistedTokenSchema);