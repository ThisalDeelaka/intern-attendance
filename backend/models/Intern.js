const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
});

const internSchema = new mongoose.Schema({
  traineeId: { type: String, required: true, unique: true },  // Trainee ID from XLSX
  traineeName: { type: String, required: true },  // Trainee Name from XLSX
  fieldOfSpecialization: { type: String, required: true },  // Field_of_Specialization from XLSX
  team: { type: String, default: "" },  // Initially empty, will be added later
  attendance: [attendanceSchema],  // Attendance tracking
});

module.exports = mongoose.model('Intern', internSchema);
