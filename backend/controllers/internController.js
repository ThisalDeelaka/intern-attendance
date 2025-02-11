const path = require('path');  // Import the path module
const { parseXLSX, addInternsFromXLSX } = require('../utils/csvHandler');

// File upload handling
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase(); // Using 'path' to get the file extension

    let interns;
    if (fileExtension === '.xlsx') {
      interns = await parseXLSX(filePath);
    } else {
      return res.status(400).json({ message: 'Unsupported file type. Please upload an XLSX file.' });
    }

    await addInternsFromXLSX(interns); // Add the parsed interns to the database
    res.status(200).json({ message: 'Interns added successfully!' });
  } catch (error) {
    console.error('Error during file upload:', error);  // Log the detailed error
    res.status(500).json({ message: 'Error processing file', error: error.message });
  }
};

module.exports = {
  uploadFile,
};
