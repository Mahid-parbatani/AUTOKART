import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
const BlacklistedTokenDB = require('../model/blackListedTokens');
const BlacklistedUserDB = require('../model/BlacklistedUser');
const BlacklistedIPDB = require('../model/BlacklistedIP');

const SECRET_KEY: Secret = 'bokieeem';

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

// Helper function to get client IP
const getClientIP = (req: Request): string => {
    return req.ip || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress || 
           (req.connection as any)?.socket?.remoteAddress || 
           'unknown';
};

// Helper function to check if user is blacklisted
const isUserBlacklisted = async (userId: string): Promise<boolean> => {
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

// Helper function to check if IP is blacklisted
const isIPBlacklisted = async (ipAddress: string): Promise<boolean> => {
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

// Helper function to check if token is blacklisted
const isTokenBlacklisted = async (token: string): Promise<boolean> => {
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

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') ?? 
        req.body.headers.Authorization.replace('Bearer ', '');
    
        if (!token) {
            throw new Error('No token provided');
        } 

        // Check if token is blacklisted
        const isTokenBlacklistedResult = await isTokenBlacklisted(token);
        if (isTokenBlacklistedResult) {
            throw new Error('Token is blacklisted');
        }
        
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        
        // Check if user is blacklisted
        if (decoded._id) {
            const isUserBlacklistedResult = await isUserBlacklisted(decoded._id);
            if (isUserBlacklistedResult) {
                throw new Error('User is blacklisted');
            }
        }

        // Check if IP is blacklisted
        const clientIP = getClientIP(req);
        if (clientIP !== 'unknown') {
            const isIPBlacklistedResult = await isIPBlacklisted(clientIP);
            if (isIPBlacklistedResult) {
                throw new Error('IP address is blacklisted');
            }
        }

        (req as CustomRequest).token = decoded;
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(401).json({ 
            message: 'Authentication failed',
            error: err instanceof Error ? err.message : 'Please authenticate'
        });
    }
};

// Middleware specifically for checking blacklists without JWT verification
const checkBlacklists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clientIP = getClientIP(req);
        
        // Check if IP is blacklisted
        if (clientIP !== 'unknown') {
            const isIPBlacklistedResult = await isIPBlacklisted(clientIP);
            if (isIPBlacklistedResult) {
                return res.status(403).json({ 
                    message: 'Access denied: IP address is blacklisted' 
                });
            }
        }

        next();
    } catch (err) {
        console.error('Blacklist check error:', err);
        next(); // Continue if there's an error checking blacklists
    }
};

module.exports = { auth, checkBlacklists, SECRET_KEY };