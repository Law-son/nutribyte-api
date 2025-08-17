/**
 * Heartbeat utility for keeping client connections alive during long-running requests
 */

/**
 * Set up heartbeat for a response
 * @param {Object} res - Express response object
 * @param {number} interval - Heartbeat interval in milliseconds (default: 5000ms)
 * @returns {Object} - Object with clear function and interval reference
 */
const setupHeartbeat = (res, interval = 5000) => {
    // Set up streaming response with heartbeats
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");
    res.flushHeaders?.();

    // Send heartbeats every interval to keep connection alive
    const heartbeatInterval = setInterval(() => {
        res.write(" "); // Send whitespace chunk as heartbeat
    }, interval);

    // Return object with clear function and interval reference
    return {
        clear: () => {
            if (heartbeatInterval) {
                clearInterval(heartbeatInterval);
            }
        },
        interval: heartbeatInterval
    };
};

/**
 * Send final response and clean up heartbeat
 * @param {Object} res - Express response object
 * @param {Object} heartbeat - Heartbeat object from setupHeartbeat
 * @param {Object} data - Data to send
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const sendFinalResponse = (res, heartbeat, data, statusCode = 200) => {
    // Clear heartbeat interval
    heartbeat.clear();

    // Send the final result
    res.write(JSON.stringify(data));
    res.end();
};

/**
 * Handle error and clean up heartbeat
 * @param {Object} res - Express response object
 * @param {Object} heartbeat - Heartbeat object from setupHeartbeat
 * @param {Error} error - Error object
 * @param {number} statusCode - HTTP status code (default: 500)
 */
const handleErrorWithHeartbeat = (res, heartbeat, error, statusCode = 500) => {
    // Clear heartbeat interval
    heartbeat.clear();

    // Send error response
    res.status(statusCode).json({
        success: false,
        message: error.message || 'An error occurred',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
};

module.exports = {
    setupHeartbeat,
    sendFinalResponse,
    handleErrorWithHeartbeat
};
