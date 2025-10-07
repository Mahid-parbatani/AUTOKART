const mongoose = require('mongoose');
require('dotenv').config();

// Import the cleanup function
const { cleanupExpiredEntries } = require('../services/blackbookService');
const { connectDB } = require('../config/dbConnection');

const runCleanup = async () => {
    try {
        console.log('Starting blacklist cleanup...');
        
        // Connect to database
        await connectDB();
        
        // Run cleanup
        const result = await cleanupExpiredEntries();
        
        console.log('Cleanup completed successfully:');
        console.log(`- Expired users cleaned: ${result.expiredUsers}`);
        console.log(`- Expired IPs cleaned: ${result.expiredIPs}`);
        console.log(`- Expired tokens cleaned: ${result.expiredTokens}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Cleanup failed:', error);
        process.exit(1);
    }
};

// Run cleanup if this script is executed directly
if (require.main === module) {
    runCleanup();
}

module.exports = { runCleanup };