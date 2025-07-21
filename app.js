
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 


const authRoutes = require('./src/routes/auth.routes');
const professorRoutes = require('./src/routes/professor.routes');
const studentRoutes = require('./src/routes/student.routes');


const app = express();



app.use(express.json());


const MONGO_URI = 'mongodb://localhost:27017/college-appointment-system';


app.use('/api/auth', authRoutes);
app.use('/api/professor', professorRoutes);
app.use('/api/student', studentRoutes);




if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
  });
}


module.exports = app;