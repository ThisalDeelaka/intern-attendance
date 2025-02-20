const xlsx = require("xlsx");
const Intern = require("../models/Intern");

const parseXLSX = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    
    const interns = jsonData.slice(2).map((row) => ({
      traineeId: row[0], 
      traineeName: row[1],
      fieldOfSpecialization: row[2],
    }));

    return interns;
  } catch (error) {
    console.error("Error parsing XLSX file:", error);
    throw new Error("Error processing file");
  }
};

const addInternsFromXLSX = async (interns) => {
  let addedCount = 0; 
  let skippedCount = 0; 

  for (let intern of interns) {
    if (!intern.traineeId || !intern.traineeName || !intern.fieldOfSpecialization) {
      console.log(`⚠ Skipping intern with missing details: ${JSON.stringify(intern)}`);
      skippedCount++;
      continue;
    }

    
    const existingIntern = await Intern.findOne({ traineeId: intern.traineeId });
    
    if (!existingIntern) {
      
      await Intern.create(intern);
      addedCount++;
    } else {
      console.log(`Skipping duplicate intern: ${intern.traineeId}`);
      skippedCount++;
    }
  }

  console.log(`✅ ${addedCount} new interns added, 🔁 ${skippedCount} existing interns skipped.`);
  return { addedCount, skippedCount };
};

module.exports = { parseXLSX, addInternsFromXLSX };
