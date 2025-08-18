const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const timeoutConfig = require('./config/timeout');
require('dotenv').config();

// Import routes (we'll create these next)
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const mealRoutes = require('./routes/meal.routes');
const mealLogRoutes = require('./routes/meallog.routes');
const analysisRoutes = require('./routes/analysis.routes');
const reportRoutes = require('./routes/report.routes');
const nutritionTipRoutes = require('./routes/nutritiontip.routes');
const feedbackRoutes = require('./routes/feedback.routes');

// Import error middleware
const { errorHandler } = require('./middleware/error.middleware');
const { notFound } = require('./middleware/notFound.middleware');

const app = express();

// Set timeout for all requests
app.use((req, res, next) => {
    // Set timeout from configuration
    req.setTimeout(timeoutConfig.requestTimeout);
    res.setTimeout(timeoutConfig.requestTimeout);
    next();
});

// Basic middleware
app.use(express.json({ limit: timeoutConfig.jsonLimit })); // Increase JSON limit for large AI responses
app.use(express.urlencoded({ extended: true, limit: timeoutConfig.jsonLimit }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));


app.get("/guide.html", (req, res) => {
    res.sendFile(__dirname + "/guide.html");
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/meal-logs', mealLogRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/nutrition-tips', nutritionTipRoutes);
app.use('/api/feedback', feedbackRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
    