require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Prevents Cross-Origin block when frontend contacts it
const workoutRoutes = require('./routes/workouts');

// express app
const app = express();

// middleware
app.use(express.json()); // Parses incoming JSON request bodies
app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} request received at path: ${req.path}`);
  next();
});

// routes
app.use('/api/workouts', workoutRoutes);

// connect to db
// Remove or replace your old mongoose.connect() block with this:

// 1. Establish the database connection globally
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas successfully'))
  .catch((error) => console.error('Database connection error:', error));

// 2. ONLY call app.listen if running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`Local server listening on port ${process.env.PORT || 4000}`);
  });
}

// 3. Crucial for Vercel: Export the app instance
module.exports = app;

