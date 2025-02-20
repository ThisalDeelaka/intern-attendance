const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["Present", "Absent"], default: "Absent" },
});

const internSchema = new mongoose.Schema({
  traineeId: { type: String, required: true, unique: true },
  traineeName: { type: String, required: true },
  fieldOfSpecialization: { type: String, required: true },
  team: { type: String, default: "" },
  attendance: [attendanceSchema],
});

module.exports = mongoose.model("Intern", internSchema);
