const xlsx = require('xlsx');
const Intern = require('../models/Intern');

// Utility function to parse the XLSX file
const parseXLSX = (filePath) => {
  const interns = [];
  try {
    // Read the XLSX file
    const workbook = xlsx.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const sheet = workbook.Sheets[sheet_name_list[0]]; // Assuming data is in the first sheet
    
    // Get the data starting from the third row (A3), skipping the title rows in A1 and A2
    const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 }); // header: 1 tells it to treat the first row as data

    // Slice from the third row (index 2) to skip the title rows (A1 and A2)
    jsonData.slice(2).forEach((row) => {
      console.log(row); // Log each row to verify the data
      interns.push({
        'Trainee_ID': row[0], // Assuming Trainee_ID is in the first column (A)
        'Trainee_Name': row[1], // Assuming Trainee_Name is in the second column (B)
        'Field_of_Specialization': row[2], // Assuming Field_of_Specialization is in the third column (C)
      });
    });
  } catch (error) {
    console.error("Error parsing XLSX file:", error);
  }
  return interns;
};

// Function to check for existing intern and add new ones
const addInternsFromXLSX = async (interns) => {
  for (let intern of interns) {
    // Ensure 'Field_of_Specialization' is provided
    if (!intern['Field_of_Specialization']) {
      console.log(`Missing Field_of_Specialization for Trainee_ID: ${intern['Trainee_ID']}`);
      continue; // Skip this intern if there's no specialization
    }

    const existingIntern = await Intern.findOne({ traineeId: intern['Trainee_ID'] });
    if (!existingIntern) {
      const newIntern = new Intern({
        traineeId: intern['Trainee_ID'],
        traineeName: intern['Trainee_Name'],
        fieldOfSpecialization: intern['Field_of_Specialization'], // Ensure this value is correctly passed
        team: "",  // Initially empty, will be added later
      });
      await newIntern.save();
    }
  }
};

module.exports = { parseXLSX, addInternsFromXLSX };
