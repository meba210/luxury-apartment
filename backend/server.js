const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const apartmentsRouter = require('./routes/apartments');
const inquiriesRouter = require('./routes/inquiries');
const inquiriesAdminRouter = require('./routes/inquiries_admin');
const partnersRouter = require('./routes/partners');
const adminRouter = require('./routes/admin');
const uploadsRouter = require('./routes/uploads');
const ratingsRouter = require('./routes/ratings');
const initializeDatabase = require('./config/initDb');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://milevia-estates.vercel.app',
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/apartments', apartmentsRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/admin/inquiries', inquiriesAdminRouter);
app.use('/api/partners', partnersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/uploads', uploadsRouter);
app.use('/api/ratings', ratingsRouter);

// Initialize database on startup
initializeDatabase().catch((err) => console.error('Init error:', err));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Luxury Apartments API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🏢 Luxury Apartments API running on port ${PORT}`);
});
