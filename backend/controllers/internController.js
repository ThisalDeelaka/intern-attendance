const path = require('path');  
const { parseXLSX, addInternsFromXLSX } = require('../utils/csvHandler');


const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase(); 

    let interns;
    if (fileExtension === '.xlsx') {
      interns = await parseXLSX(filePath);
    } else {
      return res.status(400).json({ message: 'Unsupported file type. Please upload an XLSX file.' });
    }

    await addInternsFromXLSX(interns); 
    res.status(200).json({ message: 'Interns added successfully!' });
  } catch (error) {
    console.error('Error during file upload:', error);  
    res.status(500).json({ message: 'Error processing file', error: error.message });
  }
};

module.exports = {
  uploadFile,
};
