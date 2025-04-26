const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseRoutes = require('./routes/courses');
const moduleRoutes = require('./routes/modules');
const lessonRoutes = require('./routes/lessons');
const reportRoutes = require('./routes/reportRoutes');
const { BadRequestError } = require('./errors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static file serving
app.use('/uploads/lessons', express.static(path.join(__dirname, '../uploads/lessons')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.name === 'BadRequestError') {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details
    });
  }
  
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 