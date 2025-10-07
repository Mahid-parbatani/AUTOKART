import { Document } from 'mongoose';

export interface BlacklistedToken extends Document {
    token: string;
}