const cors = require('cors');

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://milevia-estates.vercel.app',
    'https://mileviaestates.com',
    'https://www.mileviaestates.com',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = cors(corsOptions);
