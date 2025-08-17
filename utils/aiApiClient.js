// AI API Client with timeout configuration
const CUSTOM_AI_API_URL = 'https://rag-health.onrender.com/chat';
const timeoutConfig = require('../config/timeout');

/**
 * Make a fetch request with timeout and retry logic
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds (default from config)
 * @param {number} retries - Number of retries (default from config)
 * @returns {Promise} - Fetch response
 */
const fetchWithTimeout = async (url, options = {}, timeout = timeoutConfig.fetchTimeout, retries = timeoutConfig.aiApiRetries) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchOptions = {
        ...options,
        signal: controller.signal
    };

    try {
        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error(`Request timed out after ${timeout / 1000} seconds`);
        }
        
        // Retry logic
        if (retries > 0) {
            console.log(`Retrying request... (${retries} retries left)`);
            return fetchWithTimeout(url, options, timeout, retries - 1);
        }
        
        throw error;
    }
};

/**
 * Make a request to the Custom AI API
 * @param {Object} payload - The request payload
 * @param {number} timeout - Timeout in milliseconds (default from config)
 * @returns {Promise<Object>} - The AI response
 */
const makeAIRequest = async (payload, timeout = timeoutConfig.aiApiTimeout) => {
    console.log(`[AI API Client] Making request with ${timeout / 1000}s timeout`);
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    try {
        const response = await fetchWithTimeout(CUSTOM_AI_API_URL, options, timeout);
        
        if (!response.ok) {
            throw new Error(`Custom AI API error: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log(`[AI API Client] Request completed successfully`);
        return result;
    } catch (error) {
        console.error(`[AI API Client] Request failed:`, error.message);
        throw error;
    }
};

module.exports = {
    makeAIRequest,
    fetchWithTimeout,
    CUSTOM_AI_API_URL
};
