const app = require('./app');
const timeoutConfig = require('./config/timeout');
require('./config/db');

const PORT = process.env.PORT || 3000;

// Create server with extended timeout for AI API calls
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});

// Set server timeout from configuration
server.timeout = timeoutConfig.serverTimeout;
console.log(`Server timeout set to ${server.timeout / 1000} seconds`);

// Handle server timeout events
server.on('timeout', (socket) => {
    console.log('Server timeout occurred');
    socket.destroy();
});
