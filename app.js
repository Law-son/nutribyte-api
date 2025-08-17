const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes (we'll create these next)
const authRoutes = require('./routes/auth.routes');
const profileRoutes = require('./routes/profile.routes');
const mealRoutes = require('./routes/meal.routes');
const mealLogRoutes = require('./routes/meallog.routes');
const analysisRoutes = require('./routes/analysis.routes');
const reportRoutes = require('./routes/report.routes');
const nutritionTipRoutes = require('./routes/nutritionTip.routes');
const feedbackRoutes = require('./routes/feedback.routes');

// Import error middleware
const { errorHandler } = require('./middleware/error.middleware');
const { notFound } = require('./middleware/notFound.middleware');

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

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
    