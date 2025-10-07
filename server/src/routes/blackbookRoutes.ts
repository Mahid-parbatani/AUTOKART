import express from 'express';
const BlackbookController = require('../controllers/blackbookController');
const router = express.Router();

// Get blackbook metadata (types, reasons, statuses)
router.get('/metadata', (req, res) => BlackbookController.BlackbookController.getMetadata(req, res));

// Get blackbook statistics
router.get('/statistics', (req, res) => BlackbookController.BlackbookController.getStatistics(req, res));

// Check if a value is blacklisted
router.get('/check/:type/:value', (req, res) => BlackbookController.BlackbookController.checkBlacklist(req, res));

// Get blackbook entries with pagination and filtering
router.get('/entries', (req, res) => BlackbookController.BlackbookController.getEntries(req, res));

// Get specific blackbook entry
router.get('/entries/:type/:value', (req, res) => BlackbookController.BlackbookController.getEntry(req, res));

// Add new blackbook entry
router.post('/entries', (req, res) => BlackbookController.BlackbookController.addEntry(req, res));

// Bulk add entries
router.post('/entries/bulk', (req, res) => BlackbookController.BlackbookController.bulkAddEntries(req, res));

// Update entry status
router.patch('/entries/:id/status', (req, res) => BlackbookController.BlackbookController.updateEntryStatus(req, res));

// Remove blackbook entry
router.delete('/entries/:id', (req, res) => BlackbookController.BlackbookController.removeEntry(req, res));

// Cleanup expired entries
router.post('/cleanup', (req, res) => BlackbookController.BlackbookController.cleanupExpired(req, res));

module.exports = router;