const xlsx = require('xlsx');
const Intern = require('../models/Intern');


const parseXLSX = (filePath) => {
  const interns = [];
  try {
    
    const workbook = xlsx.readFile(filePath);
    const sheet_name_list = workbook.SheetNames;
    const sheet = workbook.Sheets[sheet_name_list[0]]; 
    
    
    const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 }); 

    
    jsonData.slice(2).forEach((row) => {
      console.log(row); 
      interns.push({
        'Trainee_ID': row[0], 
        'Trainee_Name': row[1], 
        'Field_of_Specialization': row[2], 
      });
    });
  } catch (error) {
    console.error("Error parsing XLSX file:", error);
  }
  return interns;
};


const addInternsFromXLSX = async (interns) => {
  for (let intern of interns) {
    
    if (!intern['Field_of_Specialization']) {
      console.log(`Missing Field_of_Specialization for Trainee_ID: ${intern['Trainee_ID']}`);
      continue; 
    }

    const existingIntern = await Intern.findOne({ traineeId: intern['Trainee_ID'] });
    if (!existingIntern) {
      const newIntern = new Intern({
        traineeId: intern['Trainee_ID'],
        traineeName: intern['Trainee_Name'],
        fieldOfSpecialization: intern['Field_of_Specialization'], 
        team: "", 
      });
      await newIntern.save();
    }
  }
};

module.exports = { parseXLSX, addInternsFromXLSX };
