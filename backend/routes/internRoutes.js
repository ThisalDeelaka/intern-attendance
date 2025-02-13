const express = require("express");
const router = express.Router();
const { uploadFile } = require("../controllers/internController");
const upload = require("../middleware/uploadMiddleware");
const Intern = require("../models/Intern");



// Upload interns from an XLSX file
router.post("/upload", upload.single("file"), uploadFile);

router.get("/attendance-stats", async (req, res) => {
  try {
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    
    const interns = await Intern.find();
    
    const stats = {
      present: 0,
      absent: 0
    };

    
    interns.forEach(intern => {
      if (Array.isArray(intern.attendance)) {
        const todayAttendance = intern.attendance.find(a => {
          const attendanceDate = new Date(a.date);
          return attendanceDate.setHours(0, 0, 0, 0) === today.getTime();
        });

        if (todayAttendance) {
          if (todayAttendance.status === 'Present') {
            stats.present++;
          } else if (todayAttendance.status === 'Absent') {
            stats.absent++;
          }
        }
      } else {
        console.warn(`No attendance data for intern ${intern._id}`);
      }
    });

    console.log("Attendance stats:", stats);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error calculating attendance stats:", error);
    res.status(500).json({ message: "Error calculating attendance stats", error: error.stack });
  }
});


router.get("/:id", async (req, res) => {
  try {
    
    console.log("Fetching intern with ID:", req.params.id);

    const intern = await Intern.findById(req.params.id);

 
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    
    console.log("Intern data:", intern);

    res.status(200).json(intern);
  } catch (error) {
    
    console.error("Error fetching intern data:", error);

    
    res.status(500).json({
      message: "Error fetching intern data",
      error: error.message,
      stack: error.stack 
    });
  }
});


router.get("/", async (req, res) => {
  try {
    const interns = await Intern.find();
    res.status(200).json(interns);
  } catch (error) {
    console.error("Error fetching interns:", error);
    res.status(500).json({ message: "Error fetching interns", error: error.message });
  }
});


router.post("/mark-attendance/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const intern = await Intern.findById(req.params.id);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    // Get today's date without time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance for today has already been marked
    const attendanceIndex = intern.attendance.findIndex(
      (entry) => new Date(entry.date).setHours(0, 0, 0, 0) === today.getTime()
    );

    if (attendanceIndex !== -1) {
      // Update attendance status if already marked
      intern.attendance[attendanceIndex].status = status;
    } else {
      // Add new attendance for today
      intern.attendance.push({ date: new Date(), status: status || "Absent" });
    }

    await intern.save();
    res.status(200).json({ message: "Attendance marked successfully", intern });
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance", error: error.message });
  }
});



router.delete("/:id", async (req, res) => {
  try {
    const intern = await Intern.findByIdAndDelete(req.params.id);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }

    res.status(200).json(intern);
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
