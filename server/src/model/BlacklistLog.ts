import mongoose, { Schema } from 'mongoose';
import { BlacklistLog } from '../entities/blackbookEntity';

const blacklistLogSchema = new Schema<BlacklistLog>({
    action: {
        type: String,
        enum: ['ADD', 'REMOVE', 'UPDATE'],
        required: true
    },
    entityType: {
        type: String,
        enum: ['USER', 'IP', 'TOKEN'],
        required: true
    },
    entityId: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    performedBy: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    details: {
        type: Schema.Types.Mixed,
        default: null
    }
});

// Index for efficient queries
blacklistLogSchema.index({ timestamp: -1 });
blacklistLogSchema.index({ entityType: 1, entityId: 1 });
blacklistLogSchema.index({ performedBy: 1 });

module.exports = mongoose.model<BlacklistLog>('BlacklistLog', blacklistLogSchema);