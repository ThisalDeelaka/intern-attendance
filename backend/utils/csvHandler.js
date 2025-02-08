const fs = require('fs');
const csv = require('csv-parser');
const Intern = require('../models/Intern');

// Utility function to parse the CSV file
const parseCSV = (filePath) => {
  const interns = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        interns.push(row);
      })
      .on('end', () => {
        resolve(interns);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

// Function to check for existing intern and add new ones
const addInternsFromCSV = async (interns) => {
  for (let intern of interns) {
    const existingIntern = await Intern.findOne({ traineeId: intern['Trainee ID'] });
    if (!existingIntern) {
      const newIntern = new Intern({
        group: intern['Group'],
        traineeId: intern['Trainee ID'],
        traineeName: intern['Trainee Name'],
        team: intern['Team'],
      });
      await newIntern.save();
    }
  }
};

module.exports = { parseCSV, addInternsFromCSV };
