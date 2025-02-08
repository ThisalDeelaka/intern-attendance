const { parseCSV, addInternsFromCSV } = require('../utils/csvHandler');

const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const interns = await parseCSV(filePath);
    await addInternsFromCSV(interns);

    res.status(200).json({ message: 'Interns added successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing CSV file', error: error.message });
  }
};

module.exports = {
  uploadCSV,
};
