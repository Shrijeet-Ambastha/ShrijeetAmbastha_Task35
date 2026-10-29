const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  load: {
    type: Number,
    required: true
  },
  reps: {
    type: Number,
    required: true
  }
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt'

module.exports = mongoose.model('Workout', workoutSchema);
