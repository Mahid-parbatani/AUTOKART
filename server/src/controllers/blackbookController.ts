import { Request, Response } from 'express';
import { BlackbookService } from '../services/blackbookService';
import { BlackbookType, BlackbookReason, BlackbookStatus } from '../entities/blackbookEntryEntity';

interface CustomRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export class BlackbookController {
    /**
     * Add a new blackbook entry
     */
    static async addEntry(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { type, value, reason, description, expiresAt, metadata } = req.body;
            const createdBy = req.user?.id || 'system'; // Assuming user ID is available in req.user

            if (!type || !value || !reason) {
                res.status(400).json({
                    success: false,
                    message: 'Type, value, and reason are required'
                });
                return;
            }

            if (!Object.values(BlackbookType).includes(type)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid blackbook type'
                });
                return;
            }

            if (!Object.values(BlackbookReason).includes(reason)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid blackbook reason'
                });
                return;
            }

            const entry = await BlackbookService.addEntry(
                type,
                value,
                reason,
                createdBy,
                description,
                expiresAt ? new Date(expiresAt) : undefined,
                metadata
            );

            res.status(201).json({
                success: true,
                message: 'Blackbook entry added successfully',
                data: entry
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Check if a value is blacklisted
     */
    static async checkBlacklist(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { type, value } = req.params;

            if (!type || !value) {
                res.status(400).json({
                    success: false,
                    message: 'Type and value are required'
                });
                return;
            }

            if (!Object.values(BlackbookType).includes(type as BlackbookType)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid blackbook type'
                });
                return;
            }

            const isBlacklisted = await BlackbookService.isBlacklisted(
                type as BlackbookType,
                value
            );

            res.json({
                success: true,
                data: {
                    isBlacklisted,
                    type,
                    value
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Get blackbook entries with pagination and filtering
     */
    static async getEntries(req: CustomRequest, res: Response): Promise<void> {
        try {
            const {
                page = 1,
                limit = 10,
                type,
                status,
                search
            } = req.query;

            const result = await BlackbookService.getEntries(
                parseInt(page as string),
                parseInt(limit as string),
                type as BlackbookType,
                status as BlackbookStatus,
                search as string
            );

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Get a specific blackbook entry
     */
    static async getEntry(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { type, value } = req.params;

            if (!type || !value) {
                res.status(400).json({
                    success: false,
                    message: 'Type and value are required'
                });
                return;
            }

            const entry = await BlackbookService.getEntry(
                type as BlackbookType,
                value
            );

            if (!entry) {
                res.status(404).json({
                    success: false,
                    message: 'Blackbook entry not found'
                });
                return;
            }

            res.json({
                success: true,
                data: entry
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Update blackbook entry status
     */
    static async updateEntryStatus(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const updatedBy = req.user?.id || 'system';

            if (!status || !Object.values(BlackbookStatus).includes(status)) {
                res.status(400).json({
                    success: false,
                    message: 'Valid status is required'
                });
                return;
            }

            const entry = await BlackbookService.updateEntryStatus(
                id,
                status,
                updatedBy
            );

            if (!entry) {
                res.status(404).json({
                    success: false,
                    message: 'Blackbook entry not found'
                });
                return;
            }

            res.json({
                success: true,
                message: 'Blackbook entry status updated successfully',
                data: entry
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Remove blackbook entry
     */
    static async removeEntry(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const success = await BlackbookService.removeEntry(id);

            if (!success) {
                res.status(404).json({
                    success: false,
                    message: 'Blackbook entry not found'
                });
                return;
            }

            res.json({
                success: true,
                message: 'Blackbook entry removed successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Bulk add entries to blackbook
     */
    static async bulkAddEntries(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { entries } = req.body;
            const createdBy = req.user?.id || 'system';

            if (!Array.isArray(entries) || entries.length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'Entries array is required and must not be empty'
                });
                return;
            }

            const result = await BlackbookService.bulkAddEntries(entries, createdBy);

            res.status(201).json({
                success: true,
                message: 'Bulk add operation completed',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Get blackbook statistics
     */
    static async getStatistics(req: CustomRequest, res: Response): Promise<void> {
        try {
            const statistics = await BlackbookService.getStatistics();

            res.json({
                success: true,
                data: statistics
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Cleanup expired entries
     */
    static async cleanupExpired(req: CustomRequest, res: Response): Promise<void> {
        try {
            const deletedCount = await BlackbookService.cleanupExpiredEntries();

            res.json({
                success: true,
                message: `Cleaned up ${deletedCount} expired entries`,
                data: { deletedCount }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }

    /**
     * Get available blackbook types and reasons
     */
    static async getMetadata(req: CustomRequest, res: Response): Promise<void> {
        try {
            res.json({
                success: true,
                data: {
                    types: Object.values(BlackbookType),
                    reasons: Object.values(BlackbookReason),
                    statuses: Object.values(BlackbookStatus)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}