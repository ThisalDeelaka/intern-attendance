const express = require("express");
const { uploadFile } = require("../controllers/internController");
const upload = require("../middleware/uploadMiddleware");
const Intern = require("../models/Intern"); // Import Intern model

const router = express.Router();

// XLSX Upload Route
router.post("/upload", upload.single("file"), uploadFile);

// Fetch All Interns Route
router.get("/", async (req, res) => {
  try {
    const interns = await Intern.find();
    res.status(200).json(interns);
  } catch (error) {
    res.status(500).json({ message: "Error fetching interns", error: error.message });
  }
});

// Mark Attendance Route (NEW)
router.post("/mark-attendance/:id", async (req, res) => {
  try {
    const { status } = req.body; // "Present" or "Absent"
    
    // Find the intern by ID
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    // Ensure "status" is valid
    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }

    // Check if attendance for today already exists
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const alreadyMarked = intern.attendance.some(
      (entry) => entry.date.toISOString().split("T")[0] === today
    );

    if (alreadyMarked) {
      return res.status(400).json({ message: "Attendance already marked for today" });
    }

    // Add today's attendance
    intern.attendance.push({ date: new Date(), status });
    await intern.save();

    res.status(200).json({ message: "Attendance updated successfully", intern });
  } catch (error) {
    res.status(500).json({ message: "Error updating attendance", error: error.message });
  }
});

module.exports = router;
