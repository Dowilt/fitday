const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'fitday',
  password: process.env.DB_PASSWORD || 'fitday123',
  database: process.env.DB_NAME || 'fitday',
});

// Wait for DB to be ready
async function waitForDB(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('Database connected');
      return;
    } catch (err) {
      console.log(`Waiting for database... (${i + 1}/${retries})`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('Could not connect to database');
}

// ===== EXERCISES =====

// Get all exercises
app.get('/api/exercises', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM exercises ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add exercise
app.post('/api/exercises', async (req, res) => {
  try {
    const { name, emoji, sets, reps, calories } = req.body;
    const result = await pool.query(
      'INSERT INTO exercises (name, emoji, sets, reps, calories) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, emoji || '⭐', sets || 3, reps || 10, calories || 30]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle exercise done
app.patch('/api/exercises/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE exercises SET is_done = NOT is_done WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete exercise
app.delete('/api/exercises/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM exercises WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json({ message: 'Deleted', exercise: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset all exercises (set is_done = false)
app.post('/api/exercises/reset', async (req, res) => {
  try {
    await pool.query('UPDATE exercises SET is_done = false');
    const result = await pool.query('SELECT * FROM exercises ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== HISTORY =====

// Get history
app.get('/api/history', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM history ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Finish day — save to history and reset
app.post('/api/history/finish', async (req, res) => {
  try {
    const exercises = await pool.query('SELECT * FROM exercises WHERE is_done = true');
    const doneCount = exercises.rows.length;
    const totalCalories = exercises.rows.reduce((sum, e) => sum + e.calories, 0);
    const date = new Date().toISOString().substring(0, 10);

    await pool.query(
      'INSERT INTO history (date, exercises_count, total_calories) VALUES ($1, $2, $3)',
      [date, doneCount, totalCalories]
    );

    // Reset exercises
    await pool.query('UPDATE exercises SET is_done = false');

    // Remove user-added exercises (keep only original 6 by resetting)
    // Actually, let's keep all exercises but just reset is_done
    const result = await pool.query('SELECT * FROM history ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== SETTINGS =====

// Get settings
app.get('/api/settings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM settings WHERE id = 1');
    if (result.rows.length === 0) {
      await pool.query(
        'INSERT INTO settings (id, calorie_goal, notifications, sound, vibration) VALUES (1, 300, true, false, true)'
      );
      const newResult = await pool.query('SELECT * FROM settings WHERE id = 1');
      return res.json(newResult.rows[0]);
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update settings
app.put('/api/settings', async (req, res) => {
  try {
    const { calorie_goal, notifications, sound, vibration } = req.body;
    const result = await pool.query(
      `UPDATE settings SET
        calorie_goal = COALESCE($1, calorie_goal),
        notifications = COALESCE($2, notifications),
        sound = COALESCE($3, sound),
        vibration = COALESCE($4, vibration)
      WHERE id = 1 RETURNING *`,
      [calorie_goal, notifications, sound, vibration]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

waitForDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitDay API running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
