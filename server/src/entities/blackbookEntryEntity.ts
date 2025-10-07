import { Document } from 'mongoose';

export enum BlackbookType {
    USER = 'user',
    PRODUCT = 'product',
    EMAIL = 'email',
    IP_ADDRESS = 'ip_address',
    PHONE = 'phone',
    TOKEN = 'token',
    CUSTOM = 'custom'
}

export enum BlackbookReason {
    FRAUD = 'fraud',
    SPAM = 'spam',
    ABUSE = 'abuse',
    VIOLATION = 'violation',
    SUSPICIOUS_ACTIVITY = 'suspicious_activity',
    MANUAL_REVIEW = 'manual_review',
    OTHER = 'other'
}

export enum BlackbookStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
    EXPIRED = 'expired'
}

export interface BlackbookEntry extends Document {
    _id: string;
    type: BlackbookType;
    value: string; // The actual value being blacklisted (email, IP, user ID, etc.)
    reason: BlackbookReason;
    description?: string; // Additional details about why it was blacklisted
    status: BlackbookStatus;
    createdBy: string; // User ID who created this entry
    expiresAt?: Date; // Optional expiration date
    metadata?: Record<string, any>; // Additional flexible data
    createdAt: Date;
    updatedAt: Date;
}