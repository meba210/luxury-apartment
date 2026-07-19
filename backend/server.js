
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
const pool = require('./config/db');



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
app.use(cors(corsOptions));

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


app.options('*', cors(corsOptions));
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

// ── Start server after database connection test ──
pool
  .query('SELECT NOW()')
  .then((result) => {
    console.log('✅ Connected to Neon (PostgreSQL)');
    console.log('📅 Server time:', result.rows[0].now);

    // Start server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`🏢 Luxury Apartments API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to Neon (PostgreSQL)');
    console.error(err);
    process.exit(1); // Exit with error code
  });