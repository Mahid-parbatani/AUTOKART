import { BlacklistedUser, BlacklistedIP, BlacklistedToken, BlacklistLog } from '../entities/blackbookEntity';
const BlacklistedUserDB = require('../model/BlacklistedUser');
const BlacklistedIPDB = require('../model/BlacklistedIP');
const BlacklistedTokenDB = require('../model/BlackListedTokens');
const BlacklistLogDB = require('../model/BlacklistLog');
const UserDB = require('../model/User');

// Helper function to log blacklist actions
const logBlacklistAction = async (
    action: 'ADD' | 'REMOVE' | 'UPDATE',
    entityType: 'USER' | 'IP' | 'TOKEN',
    entityId: string,
    reason: string,
    performedBy: string,
    details?: any
) => {
    try {
        await BlacklistLogDB.create({
            action,
            entityType,
            entityId,
            reason,
            performedBy,
            details
        });
    } catch (error) {
        console.error('Failed to log blacklist action:', error);
    }
};

// User Blacklisting
export const blacklistUser = async (
    userId: string,
    reason: string,
    blacklistedBy: string,
    expiresAt?: Date
) => {
    try {
        // Get user details
        const user = await UserDB.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Check if user is already blacklisted
        const existingBlacklist = await BlacklistedUserDB.findOne({ userId, isActive: true });
        if (existingBlacklist) {
            throw new Error('User is already blacklisted');
        }

        const blacklistedUser = await BlacklistedUserDB.create({
            userId,
            email: user.email,
            reason,
            blacklistedBy,
            expiresAt
        });

        await logBlacklistAction('ADD', 'USER', userId, reason, blacklistedBy, { email: user.email });
        return blacklistedUser;
    } catch (error) {
        throw new Error(`Error blacklisting user: ${error}`);
    }
};

export const unblacklistUser = async (userId: string, reason: string, performedBy: string) => {
    try {
        const result = await BlacklistedUserDB.findOneAndUpdate(
            { userId, isActive: true },
            { isActive: false },
            { new: true }
        );

        if (!result) {
            throw new Error('User not found in blacklist');
        }

        await logBlacklistAction('REMOVE', 'USER', userId, reason, performedBy);
        return result;
    } catch (error) {
        throw new Error(`Error unblacklisting user: ${error}`);
    }
};

export const isUserBlacklisted = async (userId: string): Promise<boolean> => {
    try {
        const blacklistedUser = await BlacklistedUserDB.findOne({
            userId,
            isActive: true,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        });
        return !!blacklistedUser;
    } catch (error) {
        console.error('Error checking user blacklist:', error);
        return false;
    }
};

// IP Blacklisting
export const blacklistIP = async (
    ipAddress: string,
    reason: string,
    blacklistedBy: string,
    expiresAt?: Date,
    country?: string,
    city?: string
) => {
    try {
        // Check if IP is already blacklisted
        const existingBlacklist = await BlacklistedIPDB.findOne({ ipAddress, isActive: true });
        if (existingBlacklist) {
            throw new Error('IP address is already blacklisted');
        }

        const blacklistedIP = await BlacklistedIPDB.create({
            ipAddress,
            reason,
            blacklistedBy,
            expiresAt,
            country,
            city
        });

        await logBlacklistAction('ADD', 'IP', ipAddress, reason, blacklistedBy, { country, city });
        return blacklistedIP;
    } catch (error) {
        throw new Error(`Error blacklisting IP: ${error}`);
    }
};

export const unblacklistIP = async (ipAddress: string, reason: string, performedBy: string) => {
    try {
        const result = await BlacklistedIPDB.findOneAndUpdate(
            { ipAddress, isActive: true },
            { isActive: false },
            { new: true }
        );

        if (!result) {
            throw new Error('IP address not found in blacklist');
        }

        await logBlacklistAction('REMOVE', 'IP', ipAddress, reason, performedBy);
        return result;
    } catch (error) {
        throw new Error(`Error unblacklisting IP: ${error}`);
    }
};

export const isIPBlacklisted = async (ipAddress: string): Promise<boolean> => {
    try {
        const blacklistedIP = await BlacklistedIPDB.findOne({
            ipAddress,
            isActive: true,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        });
        return !!blacklistedIP;
    } catch (error) {
        console.error('Error checking IP blacklist:', error);
        return false;
    }
};

// Token Blacklisting
export const blacklistToken = async (
    token: string,
    reason: string,
    userId?: string,
    expiresAt?: Date
) => {
    try {
        // Check if token is already blacklisted
        const existingBlacklist = await BlacklistedTokenDB.findOne({ token, isActive: true });
        if (existingBlacklist) {
            throw new Error('Token is already blacklisted');
        }

        const blacklistedToken = await BlacklistedTokenDB.create({
            token,
            userId,
            reason,
            expiresAt
        });

        await logBlacklistAction('ADD', 'TOKEN', token, reason, userId || 'system');
        return blacklistedToken;
    } catch (error) {
        throw new Error(`Error blacklisting token: ${error}`);
    }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
    try {
        const blacklistedToken = await BlacklistedTokenDB.findOne({
            token,
            isActive: true,
            $or: [
                { expiresAt: { $exists: false } },
                { expiresAt: null },
                { expiresAt: { $gt: new Date() } }
            ]
        });
        return !!blacklistedToken;
    } catch (error) {
        console.error('Error checking token blacklist:', error);
        return false;
    }
};

// Cleanup expired entries
export const cleanupExpiredEntries = async () => {
    try {
        const now = new Date();
        
        // Cleanup expired users
        const expiredUsers = await BlacklistedUserDB.updateMany(
            { expiresAt: { $lt: now }, isActive: true },
            { isActive: false }
        );

        // Cleanup expired IPs
        const expiredIPs = await BlacklistedIPDB.updateMany(
            { expiresAt: { $lt: now }, isActive: true },
            { isActive: false }
        );

        // Cleanup expired tokens
        const expiredTokens = await BlacklistedTokenDB.updateMany(
            { expiresAt: { $lt: now }, isActive: true },
            { isActive: false }
        );

        return {
            expiredUsers: expiredUsers.modifiedCount,
            expiredIPs: expiredIPs.modifiedCount,
            expiredTokens: expiredTokens.modifiedCount
        };
    } catch (error) {
        throw new Error(`Error cleaning up expired entries: ${error}`);
    }
};

// Get blacklist statistics
export const getBlacklistStats = async () => {
    try {
        const [activeUsers, activeIPs, activeTokens, recentLogs] = await Promise.all([
            BlacklistedUserDB.countDocuments({ isActive: true }),
            BlacklistedIPDB.countDocuments({ isActive: true }),
            BlacklistedTokenDB.countDocuments({ isActive: true }),
            BlacklistLogDB.find().sort({ timestamp: -1 }).limit(10)
        ]);

        return {
            activeUsers,
            activeIPs,
            activeTokens,
            recentLogs
        };
    } catch (error) {
        throw new Error(`Error getting blacklist stats: ${error}`);
    }
};

// Get all blacklisted users
export const getAllBlacklistedUsers = async (page: number = 1, limit: number = 10) => {
    try {
        const skip = (page - 1) * limit;
        const users = await BlacklistedUserDB.find({ isActive: true })
            .sort({ blacklistedAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await BlacklistedUserDB.countDocuments({ isActive: true });
        
        return {
            users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        throw new Error(`Error getting blacklisted users: ${error}`);
    }
};

// Get all blacklisted IPs
export const getAllBlacklistedIPs = async (page: number = 1, limit: number = 10) => {
    try {
        const skip = (page - 1) * limit;
        const ips = await BlacklistedIPDB.find({ isActive: true })
            .sort({ blacklistedAt: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await BlacklistedIPDB.countDocuments({ isActive: true });
        
        return {
            ips,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        throw new Error(`Error getting blacklisted IPs: ${error}`);
    }
};

// Get blacklist logs
export const getBlacklistLogs = async (page: number = 1, limit: number = 20) => {
    try {
        const skip = (page - 1) * limit;
        const logs = await BlacklistLogDB.find()
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);
        
        const total = await BlacklistLogDB.countDocuments();
        
        return {
            logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        throw new Error(`Error getting blacklist logs: ${error}`);
    }
};