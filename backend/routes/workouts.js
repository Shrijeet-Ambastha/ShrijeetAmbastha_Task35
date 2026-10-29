const express = require('express');
const {
  getWorkouts,
  createWorkout,
  deleteWorkout
} = require('../controllers/workoutController');

const router = express.Router();

// GET /api/workouts -> fetch all workouts
router.get('/', getWorkouts);

// POST /api/workouts -> create a workout
router.post('/', createWorkout);

// DELETE /api/workouts/:id -> delete workout by id
router.delete('/:id', deleteWorkout);

module.exports = router;
