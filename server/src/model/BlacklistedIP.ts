import mongoose, { Schema } from 'mongoose';
import { BlacklistedIP } from '../entities/blackbookEntity';

const blacklistedIPSchema = new Schema<BlacklistedIP>({
    ipAddress: { 
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
    },
    country: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    }
});

// Index for efficient queries
blacklistedIPSchema.index({ ipAddress: 1 });
blacklistedIPSchema.index({ isActive: 1, expiresAt: 1 });

module.exports = mongoose.model<BlacklistedIP>('BlacklistedIP', blacklistedIPSchema);