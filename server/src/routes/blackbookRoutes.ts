import express from 'express';
const blackbookController = require('../controllers/blackbookController');
const jwtAuth = require('../middlewear/jwtAuth');
const router = express.Router();

// Middleware to check if user is admin
const adminAuth = async (req: any, res: any, next: any) => {
    try {
        // This would need to be implemented based on your user model
        // For now, we'll assume all authenticated users can access blackbook
        // In production, you should check if the user has admin privileges
        next();
    } catch (error) {
        res.status(403).json({ message: 'Admin access required' });
    }
};

// User Blacklisting Routes
router.route('/users/blacklist')
    .post(jwtAuth.auth, adminAuth, blackbookController.blacklistUser);

router.route('/users/unblacklist')
    .post(jwtAuth.auth, adminAuth, blackbookController.unblacklistUser);

router.route('/users/check/:userId')
    .get(jwtAuth.auth, adminAuth, blackbookController.checkUserBlacklist);

router.route('/users')
    .get(jwtAuth.auth, adminAuth, blackbookController.getAllBlacklistedUsers);

router.route('/users/bulk')
    .post(jwtAuth.auth, adminAuth, blackbookController.bulkBlacklistUsers);

// IP Blacklisting Routes
router.route('/ips/blacklist')
    .post(jwtAuth.auth, adminAuth, blackbookController.blacklistIP);

router.route('/ips/unblacklist')
    .post(jwtAuth.auth, adminAuth, blackbookController.unblacklistIP);

router.route('/ips/check/:ipAddress')
    .get(jwtAuth.auth, adminAuth, blackbookController.checkIPBlacklist);

router.route('/ips')
    .get(jwtAuth.auth, adminAuth, blackbookController.getAllBlacklistedIPs);

router.route('/ips/bulk')
    .post(jwtAuth.auth, adminAuth, blackbookController.bulkBlacklistIPs);

// Token Blacklisting Routes
router.route('/tokens/blacklist')
    .post(jwtAuth.auth, adminAuth, blackbookController.blacklistToken);

router.route('/tokens/check/:token')
    .get(jwtAuth.auth, adminAuth, blackbookController.checkTokenBlacklist);

// Statistics and Management Routes
router.route('/stats')
    .get(jwtAuth.auth, adminAuth, blackbookController.getBlacklistStats);

router.route('/logs')
    .get(jwtAuth.auth, adminAuth, blackbookController.getBlacklistLogs);

router.route('/cleanup')
    .post(jwtAuth.auth, adminAuth, blackbookController.cleanupExpiredEntries);

module.exports = router;