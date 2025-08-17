// Timeout configuration for the application
require('dotenv').config();

const timeoutConfig = {
    // Server timeout (5 minutes)
    serverTimeout: parseInt(process.env.SERVER_TIMEOUT) || 30000000, // 5 minutes
    
    // Request timeout (5 minutes)
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000000, // 5 minutes
    
    // AI API timeout (3 minutes)
    aiApiTimeout: parseInt(process.env.AI_API_TIMEOUT) || 18000000, // 3 minutes
    
    // Fetch timeout (2 minutes)
    fetchTimeout: parseInt(process.env.FETCH_TIMEOUT) || 12000000, // 2 minutes
    
    // Retry attempts for AI API calls
    aiApiRetries: parseInt(process.env.AI_API_RETRIES) || 2,
    
    // JSON payload size limit (10MB)
    jsonLimit: process.env.JSON_LIMIT || '10mb'
};

module.exports = timeoutConfig;
