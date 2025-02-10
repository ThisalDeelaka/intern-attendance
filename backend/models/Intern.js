const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
});

const internSchema = new mongoose.Schema({
  group: { type: String, required: true },
  traineeId: { type: String, required: true, unique: true },
  traineeName: { type: String, required: true },
  team: { type: String, required: true },
  attendance: [attendanceSchema],  
});

module.exports = mongoose.model('Intern', internSchema);
