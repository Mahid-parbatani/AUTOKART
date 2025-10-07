import { Request, Response, NextFunction } from 'express';
import { BlackbookService } from '../services/blackbookService';
import { BlackbookType } from '../entities/blackbookEntryEntity';

export class BlackbookMiddleware {
    /**
     * Middleware to check if user is blacklisted
     */
    static async checkUserBlacklist(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.id || req.body?.userId;
            const email = req.user?.email || req.body?.email;

            if (userId) {
                const isUserBlacklisted = await BlackbookService.isBlacklisted(
                    BlackbookType.USER,
                    userId
                );
                if (isUserBlacklisted) {
                    res.status(403).json({
                        success: false,
                        message: 'User is blacklisted'
                    });
                    return;
                }
            }

            if (email) {
                const isEmailBlacklisted = await BlackbookService.isBlacklisted(
                    BlackbookType.EMAIL,
                    email
                );
                if (isEmailBlacklisted) {
                    res.status(403).json({
                        success: false,
                        message: 'Email is blacklisted'
                    });
                    return;
                }
            }

            next();
        } catch (error) {
            console.error('Blackbook middleware error:', error);
            next(); // Continue on error to avoid blocking legitimate requests
        }
    }

    /**
     * Middleware to check if IP is blacklisted
     */
    static async checkIPBlacklist(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
            
            if (clientIP) {
                const isIPBlacklisted = await BlackbookService.isBlacklisted(
                    BlackbookType.IP_ADDRESS,
                    clientIP
                );
                if (isIPBlacklisted) {
                    res.status(403).json({
                        success: false,
                        message: 'IP address is blacklisted'
                    });
                    return;
                }
            }

            next();
        } catch (error) {
            console.error('IP blacklist middleware error:', error);
            next(); // Continue on error
        }
    }

    /**
     * Middleware to check if product is blacklisted
     */
    static async checkProductBlacklist(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params?.id || req.body?.productId;

            if (productId) {
                const isProductBlacklisted = await BlackbookService.isBlacklisted(
                    BlackbookType.PRODUCT,
                    productId
                );
                if (isProductBlacklisted) {
                    res.status(403).json({
                        success: false,
                        message: 'Product is blacklisted'
                    });
                    return;
                }
            }

            next();
        } catch (error) {
            console.error('Product blacklist middleware error:', error);
            next(); // Continue on error
        }
    }

    /**
     * General blacklist checker middleware
     */
    static async checkBlacklist(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Check user blacklist
            await this.checkUserBlacklist(req, res, () => {});
            if (res.headersSent) return;

            // Check IP blacklist
            await this.checkIPBlacklist(req, res, () => {});
            if (res.headersSent) return;

            // Check product blacklist if applicable
            await this.checkProductBlacklist(req, res, () => {});
            if (res.headersSent) return;

            next();
        } catch (error) {
            console.error('General blacklist middleware error:', error);
            next(); // Continue on error
        }
    }
}