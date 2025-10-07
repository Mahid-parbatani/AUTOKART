import mongoose, { Schema } from 'mongoose';
import { BlackbookEntry, BlackbookType, BlackbookReason, BlackbookStatus } from '../entities/blackbookEntryEntity';

const blackbookEntrySchema = new Schema<BlackbookEntry>({
    type: {
        type: String,
        enum: Object.values(BlackbookType),
        required: true
    },
    value: {
        type: String,
        required: true,
        trim: true
    },
    reason: {
        type: String,
        enum: Object.values(BlackbookReason),
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: Object.values(BlackbookStatus),
        default: BlackbookStatus.ACTIVE
    },
    createdBy: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date
    },
    metadata: {
        type: Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Compound index for efficient queries
blackbookEntrySchema.index({ type: 1, value: 1 }, { unique: true });
blackbookEntrySchema.index({ status: 1, type: 1 });
blackbookEntrySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const BlackbookEntryModel = mongoose.model<BlackbookEntry>('BlackbookEntry', blackbookEntrySchema);
export default BlackbookEntryModel;
module.exports = BlackbookEntryModel;