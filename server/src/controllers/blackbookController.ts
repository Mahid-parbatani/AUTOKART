import { Request, Response } from 'express';
import { CustomRequest } from '../middlewear/jwtAuth';
import * as blackbookService from '../services/blackbookService';

// User Blacklisting
export const blacklistUser = async (req: CustomRequest, res: Response) => {
    try {
        const { userId, reason, expiresAt } = req.body;
        const blacklistedBy = (req.token as any)?._id || 'system';

        if (!userId || !reason) {
            return res.status(400).json({ 
                message: 'User ID and reason are required' 
            });
        }

        const result = await blackbookService.blacklistUser(
            userId, 
            reason, 
            blacklistedBy, 
            expiresAt ? new Date(expiresAt) : undefined
        );

        res.status(201).json({ 
            message: 'User blacklisted successfully',
            data: result 
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Error blacklisting user: ${error}` 
        });
    }
};

export const unblacklistUser = async (req: CustomRequest, res: Response) => {
    try {
        const { userId, reason } = req.body;
        const performedBy = (req.token as any)?._id || 'system';

        if (!userId || !reason) {
            return res.status(400).json({ 
                message: 'User ID and reason are required' 
            });
        }

        const result = await blackbookService.unblacklistUser(userId, reason, performedBy);

        res.status(200).json({ 
            message: 'User unblacklisted successfully',
            data: result 
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Error unblacklisting user: ${error}` 
        });
    }
};

export const checkUserBlacklist = async (req: CustomRequest, res: Response) => {
    try {
        const { userId } = req.params;
        const isBlacklisted = await blackbookService.isUserBlacklisted(userId);

        res.status(200).json({ 
            isBlacklisted,
            userId 
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Error checking user blacklist: ${error}` 
        });
    }
};

// IP Blacklisting
export const blacklistIP = async (req: CustomRequest, res: Response) => {
    try {
        const { ipAddress, reason, expiresAt, country, city } = req.body;
        const blacklistedBy = (req.token as any)?._id || 'system';

        if (!ipAddress || !reason) {
            return res.status(400).json({ 
                message: 'IP address and reason are required' 
            });
        }

        const result = await blackbookService.blacklistIP(
            ipAddress, 
            reason, 
            blacklistedBy, 
            expiresAt ? new Date(expiresAt) : undefined,
            country,
            city
        );

        res.status(201).json({ 
            message: 'IP address blacklisted successfully',
            data: result 
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Error blacklisting IP: ${error}` 
        });
    }
};

export const unblacklistIP = async (req: CustomRequest, res: Response) => {
    try {
        const { ipAddress, reason } = req.body;
        const performedBy = (req.token as any)?._id || 'system';

        if (!ipAddress || !reason) {
            return res.status(400).json({ 
                message: 'IP address and reason are required' 
            });
        }

        const result = await blackbookService.unblacklistIP(ipAddress, reason, performedBy);

        res.status(200).json({ 
            message: 'IP address unblacklisted successfully',
            data: result 
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Error unblacklisting IP: ${error}` 
        });
    }
};

export const checkIPBlacklist = async (req: CustomRequest, res: Response) => {
    try {
        const { ipAddress } = req.params;
        const isBlacklisted = await blackbookService.isIPBlacklisted(ipAddress);

        res.status(200).json({ 
            isBlacklisted,
            ipAddress 
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Error checking IP blacklist: ${error}` 
        });
    }
};

// Token Blacklisting
export const blacklistToken = async (req: CustomRequest, res: Response) => {
    try {
        const { token, reason, userId, expiresAt } = req.body;
        const performedBy = (req.token as any)?._id || 'system';

        if (!token || !reason) {
            return res.status(400).json({ 
                message: 'Token and reason are required' 
            });
        }

        const result = await blackbookService.blacklistToken(
            token, 
            reason, 
            userId, 
            expiresAt ? new Date(expiresAt) : undefined
        );

        res.status(201).json({ 
            message: 'Token blacklisted successfully',
            data: result 
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Error blacklisting token: ${error}` 
        });
    }
};

export const checkTokenBlacklist = async (req: CustomRequest, res: Response) => {
    try {
        const { token } = req.params;
        const isBlacklisted = await blackbookService.isTokenBlacklisted(token);

        res.status(200).json({ 
            isBlacklisted,
            token: token.substring(0, 20) + '...' // Only show first 20 chars for security
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Error checking token blacklist: ${error}` 
        });
    }
};

// Statistics and Management
export const getBlacklistStats = async (req: CustomRequest, res: Response) => {
    try {
        const stats = await blackbookService.getBlacklistStats();
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ 
            message: `Error getting blacklist stats: ${error}` 
        });
    }
};

export const getAllBlacklistedUsers = async (req: CustomRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const result = await blackbookService.getAllBlacklistedUsers(page, limit);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ 
            message: `Error getting blacklisted users: ${error}` 
        });
    }
};

export const getAllBlacklistedIPs = async (req: CustomRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const result = await blackbookService.getAllBlacklistedIPs(page, limit);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ 
            message: `Error getting blacklisted IPs: ${error}` 
        });
    }
};

export const getBlacklistLogs = async (req: CustomRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        
        const result = await blackbookService.getBlacklistLogs(page, limit);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ 
            message: `Error getting blacklist logs: ${error}` 
        });
    }
};

export const cleanupExpiredEntries = async (req: CustomRequest, res: Response) => {
    try {
        const result = await blackbookService.cleanupExpiredEntries();
        res.status(200).json({ 
            message: 'Cleanup completed successfully',
            data: result 
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Error cleaning up expired entries: ${error}` 
        });
    }
};

// Bulk operations
export const bulkBlacklistUsers = async (req: CustomRequest, res: Response) => {
    try {
        const { userIds, reason, expiresAt } = req.body;
        const blacklistedBy = (req.token as any)?._id || 'system';

        if (!userIds || !Array.isArray(userIds) || !reason) {
            return res.status(400).json({ 
                message: 'User IDs array and reason are required' 
            });
        }

        const results = [];
        const errors = [];

        for (const userId of userIds) {
            try {
                const result = await blackbookService.blacklistUser(
                    userId, 
                    reason, 
                    blacklistedBy, 
                    expiresAt ? new Date(expiresAt) : undefined
                );
                results.push(result);
            } catch (error) {
                errors.push({ userId, error: error.message });
            }
        }

        res.status(200).json({ 
            message: `Bulk blacklist completed. ${results.length} successful, ${errors.length} failed`,
            results,
            errors 
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Error in bulk blacklist: ${error}` 
        });
    }
};

export const bulkBlacklistIPs = async (req: CustomRequest, res: Response) => {
    try {
        const { ipAddresses, reason, expiresAt } = req.body;
        const blacklistedBy = (req.token as any)?._id || 'system';

        if (!ipAddresses || !Array.isArray(ipAddresses) || !reason) {
            return res.status(400).json({ 
                message: 'IP addresses array and reason are required' 
            });
        }

        const results = [];
        const errors = [];

        for (const ipAddress of ipAddresses) {
            try {
                const result = await blackbookService.blacklistIP(
                    ipAddress, 
                    reason, 
                    blacklistedBy, 
                    expiresAt ? new Date(expiresAt) : undefined
                );
                results.push(result);
            } catch (error) {
                errors.push({ ipAddress, error: error.message });
            }
        }

        res.status(200).json({ 
            message: `Bulk IP blacklist completed. ${results.length} successful, ${errors.length} failed`,
            results,
            errors 
        });
    } catch (error) {
        res.status(500).json({ 
            message: `Error in bulk IP blacklist: ${error}` 
        });
    }
};