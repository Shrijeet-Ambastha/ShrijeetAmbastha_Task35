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
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests only after database connectivity succeeds
    app.listen(process.env.PORT, () => {
      console.log(`Connected to Database & Server listening on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log('Database connection error:', error);
  });
