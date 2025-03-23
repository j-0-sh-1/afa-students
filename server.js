const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // Wait for the connection to be fully open
    await mongoose.connection.once('open', () => {
      console.log('Connected to database:', mongoose.connection.db.databaseName);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});