import BlackbookEntryModel from '../model/BlackbookEntry';
import { BlackbookEntry, BlackbookType, BlackbookReason, BlackbookStatus } from '../entities/blackbookEntryEntity';

export class BlackbookService {
    /**
     * Add an entry to the blackbook
     */
    static async addEntry(
        type: BlackbookType,
        value: string,
        reason: BlackbookReason,
        createdBy: string,
        description?: string,
        expiresAt?: Date,
        metadata?: Record<string, any>
    ): Promise<BlackbookEntry> {
        try {
            // Check if entry already exists
            const existingEntry = await BlackbookEntryModel.findOne({ type, value });
            if (existingEntry) {
                throw new Error(`Entry already exists for ${type}: ${value}`);
            }

            const entry = new BlackbookEntryModel({
                type,
                value: value.toLowerCase().trim(),
                reason,
                description,
                createdBy,
                expiresAt,
                metadata: metadata || {}
            });

            return await entry.save();
        } catch (error) {
            throw new Error(`Failed to add blackbook entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Check if a value is blacklisted
     */
    static async isBlacklisted(type: BlackbookType, value: string): Promise<boolean> {
        try {
            const entry = await BlackbookEntryModel.findOne({
                type,
                value: value.toLowerCase().trim(),
                status: BlackbookStatus.ACTIVE,
                $or: [
                    { expiresAt: { $exists: false } },
                    { expiresAt: { $gt: new Date() } }
                ]
            });

            return !!entry;
        } catch (error) {
            console.error('Error checking blacklist status:', error);
            return false;
        }
    }

    /**
     * Get blackbook entry by type and value
     */
    static async getEntry(type: BlackbookType, value: string): Promise<BlackbookEntry | null> {
        try {
            return await BlackbookEntryModel.findOne({
                type,
                value: value.toLowerCase().trim()
            });
        } catch (error) {
            throw new Error(`Failed to get blackbook entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get all blackbook entries with pagination and filtering
     */
    static async getEntries(
        page: number = 1,
        limit: number = 10,
        type?: BlackbookType,
        status?: BlackbookStatus,
        search?: string
    ): Promise<{ entries: BlackbookEntry[], total: number, pages: number }> {
        try {
            const query: any = {};
            
            if (type) query.type = type;
            if (status) query.status = status;
            if (search) {
                query.$or = [
                    { value: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            const skip = (page - 1) * limit;
            
            const [entries, total] = await Promise.all([
                BlackbookEntryModel.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                BlackbookEntryModel.countDocuments(query)
            ]);

            return {
                entries,
                total,
                pages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw new Error(`Failed to get blackbook entries: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Update blackbook entry status
     */
    static async updateEntryStatus(
        id: string,
        status: BlackbookStatus,
        updatedBy: string
    ): Promise<BlackbookEntry | null> {
        try {
            return await BlackbookEntryModel.findByIdAndUpdate(
                id,
                { 
                    status,
                    updatedAt: new Date(),
                    $set: { 'metadata.lastUpdatedBy': updatedBy }
                },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Failed to update blackbook entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Remove entry from blackbook
     */
    static async removeEntry(id: string): Promise<boolean> {
        try {
            const result = await BlackbookEntryModel.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Failed to remove blackbook entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Bulk add entries to blackbook
     */
    static async bulkAddEntries(
        entries: Array<{
            type: BlackbookType;
            value: string;
            reason: BlackbookReason;
            description?: string;
            expiresAt?: Date;
            metadata?: Record<string, any>;
        }>,
        createdBy: string
    ): Promise<{ success: number, failed: number, errors: string[] }> {
        try {
            let success = 0;
            let failed = 0;
            const errors: string[] = [];

            for (const entry of entries) {
                try {
                    await this.addEntry(
                        entry.type,
                        entry.value,
                        entry.reason,
                        createdBy,
                        entry.description,
                        entry.expiresAt,
                        entry.metadata
                    );
                    success++;
                } catch (error) {
                    failed++;
                    errors.push(`${entry.value}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }

            return { success, failed, errors };
        } catch (error) {
            throw new Error(`Failed to bulk add entries: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get blackbook statistics
     */
    static async getStatistics(): Promise<{
        total: number;
        byType: Record<string, number>;
        byStatus: Record<string, number>;
        byReason: Record<string, number>;
    }> {
        try {
            const [total, byType, byStatus, byReason] = await Promise.all([
                BlackbookEntryModel.countDocuments(),
                BlackbookEntryModel.aggregate([
                    { $group: { _id: '$type', count: { $sum: 1 } } }
                ]),
                BlackbookEntryModel.aggregate([
                    { $group: { _id: '$status', count: { $sum: 1 } } }
                ]),
                BlackbookEntryModel.aggregate([
                    { $group: { _id: '$reason', count: { $sum: 1 } } }
                ])
            ]);

            return {
                total,
                byType: byType.reduce((acc: any, item: any) => ({ ...acc, [item._id]: item.count }), {}),
                byStatus: byStatus.reduce((acc: any, item: any) => ({ ...acc, [item._id]: item.count }), {}),
                byReason: byReason.reduce((acc: any, item: any) => ({ ...acc, [item._id]: item.count }), {})
            };
        } catch (error) {
            throw new Error(`Failed to get blackbook statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Clean up expired entries
     */
    static async cleanupExpiredEntries(): Promise<number> {
        try {
            const result = await BlackbookEntryModel.deleteMany({
                expiresAt: { $lt: new Date() },
                status: BlackbookStatus.ACTIVE
            });
            return result.deletedCount || 0;
        } catch (error) {
            throw new Error(`Failed to cleanup expired entries: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}