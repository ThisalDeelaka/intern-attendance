const express = require('express');
const { uploadCSV } = require('../controllers/internController');
const upload = require('../middleware/uploadMiddleware'); // Import upload middleware

const router = express.Router();

// CSV upload route
router.post('/upload', upload.single('file'), uploadCSV);

module.exports = router;
