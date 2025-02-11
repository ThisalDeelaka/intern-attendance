const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors"); 
const internRoutes = require('./routes/internRoutes');
const path = require('path');


dotenv.config();


const app = express();
app.use(cors());

app.use(express.json());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


app.use('/api/interns', internRoutes);


app.get('/', (req, res) => {
  res.send('Server is up and running!');
});



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
