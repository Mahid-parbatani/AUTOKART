import mongoose from 'mongoose';
import { BlackbookService } from '../src/services/blackbookService';
import { BlackbookType, BlackbookReason, BlackbookStatus } from '../src/entities/blackbookEntryEntity';

const DATABASE_URL = `mongodb+srv://carparts:carparts@carparts.mgmpyqm.mongodb.net/?retryWrites=true&w=majority&appName=CarParts`;

const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
    } catch (error) {
        console.log(error);
    }
};

beforeAll(async () => {
    await connectDB();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('BlackbookService', () => {
  beforeEach(async () => {
    // Clean up any existing test data
    const BlackbookEntryModel = require('../src/model/BlackbookEntry');
    await BlackbookEntryModel.deleteMany({});
  });

  describe('addEntry', () => {
    it('should add a new blackbook entry', async () => {
      const entry = await BlackbookService.addEntry(
        BlackbookType.EMAIL,
        'test@example.com',
        BlackbookReason.SPAM,
        'test-user',
        'Test spam email'
      );

      expect(entry).toBeDefined();
      expect(entry.type).toBe(BlackbookType.EMAIL);
      expect(entry.value).toBe('test@example.com');
      expect(entry.reason).toBe(BlackbookReason.SPAM);
      expect(entry.status).toBe(BlackbookStatus.ACTIVE);
    });

    it('should throw error for duplicate entry', async () => {
      await BlackbookService.addEntry(
        BlackbookType.EMAIL,
        'test@example.com',
        BlackbookReason.SPAM,
        'test-user'
      );

      await expect(
        BlackbookService.addEntry(
          BlackbookType.EMAIL,
          'test@example.com',
          BlackbookReason.SPAM,
          'test-user'
        )
      ).rejects.toThrow('Entry already exists');
    });
  });

  describe('isBlacklisted', () => {
    it('should return true for blacklisted value', async () => {
      await BlackbookService.addEntry(
        BlackbookType.EMAIL,
        'blacklisted@example.com',
        BlackbookReason.SPAM,
        'test-user'
      );

      const isBlacklisted = await BlackbookService.isBlacklisted(
        BlackbookType.EMAIL,
        'blacklisted@example.com'
      );

      expect(isBlacklisted).toBe(true);
    });

    it('should return false for non-blacklisted value', async () => {
      const isBlacklisted = await BlackbookService.isBlacklisted(
        BlackbookType.EMAIL,
        'clean@example.com'
      );

      expect(isBlacklisted).toBe(false);
    });

    it('should return false for inactive entry', async () => {
      const entry = await BlackbookService.addEntry(
        BlackbookType.EMAIL,
        'inactive@example.com',
        BlackbookReason.SPAM,
        'test-user'
      );

      await BlackbookService.updateEntryStatus(
        entry._id.toString(),
        BlackbookStatus.INACTIVE,
        'test-user'
      );

      const isBlacklisted = await BlackbookService.isBlacklisted(
        BlackbookType.EMAIL,
        'inactive@example.com'
      );

      expect(isBlacklisted).toBe(false);
    });
  });

  describe('getEntries', () => {
    it('should return paginated entries', async () => {
      // Add test entries
      await BlackbookService.addEntry(
        BlackbookType.EMAIL,
        'test1@example.com',
        BlackbookReason.SPAM,
        'test-user'
      );
      await BlackbookService.addEntry(
        BlackbookType.USER,
        'user123',
        BlackbookReason.FRAUD,
        'test-user'
      );

      const result = await BlackbookService.getEntries(1, 10);

      expect(result.entries).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.pages).toBe(1);
    });

    it('should filter by type', async () => {
      await BlackbookService.addEntry(
        BlackbookType.EMAIL,
        'test@example.com',
        BlackbookReason.SPAM,
        'test-user'
      );
      await BlackbookService.addEntry(
        BlackbookType.USER,
        'user123',
        BlackbookReason.FRAUD,
        'test-user'
      );

      const result = await BlackbookService.getEntries(1, 10, BlackbookType.EMAIL);

      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].type).toBe(BlackbookType.EMAIL);
    });
  });

  describe('updateEntryStatus', () => {
    it('should update entry status', async () => {
      const entry = await BlackbookService.addEntry(
        BlackbookType.EMAIL,
        'test@example.com',
        BlackbookReason.SPAM,
        'test-user'
      );

      const updatedEntry = await BlackbookService.updateEntryStatus(
        entry._id.toString(),
        BlackbookStatus.INACTIVE,
        'test-user'
      );

      expect(updatedEntry?.status).toBe(BlackbookStatus.INACTIVE);
    });
  });

  describe('removeEntry', () => {
    it('should remove entry', async () => {
      const entry = await BlackbookService.addEntry(
        BlackbookType.EMAIL,
        'test@example.com',
        BlackbookReason.SPAM,
        'test-user'
      );

      const removed = await BlackbookService.removeEntry(entry._id.toString());
      expect(removed).toBe(true);

      const isBlacklisted = await BlackbookService.isBlacklisted(
        BlackbookType.EMAIL,
        'test@example.com'
      );
      expect(isBlacklisted).toBe(false);
    });
  });

  describe('getStatistics', () => {
    it('should return correct statistics', async () => {
      await BlackbookService.addEntry(
        BlackbookType.EMAIL,
        'test1@example.com',
        BlackbookReason.SPAM,
        'test-user'
      );
      await BlackbookService.addEntry(
        BlackbookType.EMAIL,
        'test2@example.com',
        BlackbookReason.SPAM,
        'test-user'
      );
      await BlackbookService.addEntry(
        BlackbookType.USER,
        'user123',
        BlackbookReason.FRAUD,
        'test-user'
      );

      const stats = await BlackbookService.getStatistics();

      expect(stats.total).toBe(3);
      expect(stats.byType.email).toBe(2);
      expect(stats.byType.user).toBe(1);
      expect(stats.byReason.spam).toBe(2);
      expect(stats.byReason.fraud).toBe(1);
    });
  });
});