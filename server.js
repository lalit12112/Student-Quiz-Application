const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db'); // Import the PostgreSQL connection pool

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Import routes
const quizRoutes = require('./routes/quiz');

// Use routes
app.use('/api/quiz', quizRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
