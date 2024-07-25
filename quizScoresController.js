// controllers/quizScoresController.js

const pool = require('../db'); // Assuming you have a database connection pool

// POST /api/quiz-scores - Save quiz scores
const saveQuizScore = async (req, res) => {
  const { userId, quizId, score } = req.body;

  try {
    const query = 'INSERT INTO quiz_scores (user_id, quiz_id, score) VALUES ($1, $2, $3) RETURNING *';
    const values = [userId, quizId, score];
    const result = await pool.query(query, values);

    res.json(result.rows[0]); // Respond with the inserted score record
  } catch (error) {
    console.error('Error saving quiz score:', error);
    res.status(500).json({ error: 'An error occurred while saving quiz score' });
  }
};

module.exports = {
  saveQuizScore
};
