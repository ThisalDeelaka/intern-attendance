const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors"); 
const internRoutes = require('./routes/internRoutes');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(cors());
// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/interns', internRoutes);

// Test route at the root
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});


// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Server startup
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
