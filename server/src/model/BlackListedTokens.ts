import mongoose, { Schema } from 'mongoose';
import { BlacklistedToken } from '../entities/blackListedTokensEntity'

const blacklistedTokenSchema = new Schema<BlacklistedToken>({
    token: { 
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model<BlacklistedToken>('BlacklistedToken', blacklistedTokenSchema);