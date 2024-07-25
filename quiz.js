const express = require('express');
const pool = require('../db');
const router = express.Router();

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quizzes');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM quizzes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a new quiz
router.post('/', async (req, res) => {
  try {
    const { title, questions } = req.body;
    const result = await pool.query(
      'INSERT INTO quizzes (title, questions) VALUES ($1, $2) RETURNING *',
      [title, JSON.stringify(questions)]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a quiz by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM quizzes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Save quiz score
router.post('/:id/score', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, score } = req.body;

    console.log(`Received score submission: userId=${userId}, quizId=${id}, score=${score}`);

    // Check if the quiz exists
    const quizResult = await pool.query('SELECT * FROM quizzes WHERE id = $1', [id]);
    if (quizResult.rows.length === 0) {
      return res.status(404).json({ msg: 'Quiz not found' });
    }

    // Saving quiz score
    const query = 'INSERT INTO quiz_scores (user_id, quiz_id, score) VALUES ($1, $2, $3) RETURNING *';
    const values = [userId, id, score];
    const scoreResult = await pool.query(query, values);

    res.json(scoreResult.rows[0]);
  } catch (err) {
    console.error('Error saving quiz score:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
