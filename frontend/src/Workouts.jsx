import React, { useState, useEffect } from 'react';
import './WorkoutLog.css'; // Make sure this matches your CSS filename

export default function WorkoutBuddy() {
  // 1. Initialize state as an empty array since data now comes from MongoDB
  const [workouts, setWorkouts] = useState([]);

  // Individual Form States
  const [title, setTitle] = useState('');
  const [load, setLoad] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState(null); // Optional: to capture API errors

  // 2. Fetch all workouts from backend on component mount
  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/workouts');
        const json = await response.json();

        if (response.ok) {
          setWorkouts(json);
        }
      } catch (err) {
        console.error('Failed to fetch workouts:', err);
      }
    };

    fetchWorkouts();
  }, []);

  // 3. Updated Form Submission Handler with API POST request
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !load || !reps) return;

    const workoutData = { title, load: Number(load), reps: Number(reps) };

    try {
      const response = await fetch('http://localhost:4000/api/workouts', {
        method: 'POST',
        body: JSON.stringify(workoutData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const json = await response.json();

      if (!response.ok) {
        setError(json.error);
      }
      
      if (response.ok) {
        setError(null);
        setTitle('');
        setLoad('');
        setReps('');
        // Add the new workout returned by MongoDB (contains real _id) to the top of the list
        setWorkouts([json, ...workouts]);
      }
    } catch (err) {
      setError('Server connection failed.');
    }
  };

  // 4. Updated Delete Handler with API DELETE request
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/workouts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove from local UI state using the MongoDB _id
        setWorkouts(workouts.filter(workout => workout._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete workout:', err);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="navbar">
        <h1>Workout Budyyy</h1>
      </header>

      {/* Main Content Layout */}
      <div className="main-content">
        
        {/* Left Side: Workouts List */}
        <div className="workouts-list">
          {workouts.map((workout) => (
            /* Note: MongoDB uses _id instead of id */
            <div key={workout._id} className="workout-card">
              <div className="card-info">
                <h3 className="workout-title">{workout.title}</h3>
                <p><strong>Load (In Kg's): </strong>{workout.load}</p>
                <p><strong>Reps: </strong>{workout.reps}</p>
                {/* Format the MongoDB ISO timestamp or use a helper like date-fns */}
                <p className="timestamp">
                  {new Date(workout.createdAt).toLocaleString(undefined, {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                </p>
              </div>
              <button 
                className="delete-btn" 
                onClick={() => handleDelete(workout._id)}
                aria-label="Delete workout"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Right Side: Form Element */}
        <form className="workout-form" onSubmit={handleSubmit}>
          <h3>Add a New Workout</h3>

          <div className="form-group">
            <label>Exercise Title:</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Load (in Kg's):</label>
            <input 
              type="number" 
              value={load} 
              onChange={(e) => setLoad(e.target.value)} 
              required
            />
          </div>

          <div className="form-group">
            <label>Reps:</label>
            <input 
              type="number" 
              value={reps} 
              onChange={(e) => setReps(e.target.value)} 
              required
            />
          </div>

          <button type="submit" className="submit-btn">Add Workout</button>
          
          {/* Display database validation errors if any */}
          {error && <div className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</div>}
        </form>

      </div>
    </div>
  );
}
