require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const issueRoutes = require('./routes/issues');

const app = express();

// Security and utility Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routing
app.use('/api/issues', issueRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Platform API is active', timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went incredibly wrong!' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend API actively serving on http://localhost:${PORT}`);
});
