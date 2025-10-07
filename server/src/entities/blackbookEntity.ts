import { Document } from 'mongoose';

export interface BlacklistedUser extends Document {
    userId: string;
    email: string;
    reason: string;
    blacklistedBy: string;
    blacklistedAt: Date;
    expiresAt?: Date;
    isActive: boolean;
}

export interface BlacklistedIP extends Document {
    ipAddress: string;
    reason: string;
    blacklistedBy: string;
    blacklistedAt: Date;
    expiresAt?: Date;
    isActive: boolean;
    country?: string;
    city?: string;
}

export interface BlacklistedToken extends Document {
    token: string;
    userId?: string;
    reason: string;
    blacklistedAt: Date;
    expiresAt?: Date;
    isActive: boolean;
}

export interface BlacklistLog extends Document {
    action: 'ADD' | 'REMOVE' | 'UPDATE';
    entityType: 'USER' | 'IP' | 'TOKEN';
    entityId: string;
    reason: string;
    performedBy: string;
    timestamp: Date;
    details?: any;
}