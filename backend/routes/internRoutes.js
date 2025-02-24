const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const {
  addIntern,
  getAllInterns,
  getInternById, 
  getAttendanceStats,
  markAttendance,
  updateAttendance,
  assignToTeam,
  removeFromTeam,
  updateIntern,
  removeIntern,
  uploadInterns, 
  getAllTeams,
  updateTeamName,
  assignSingleToTeam,
  deleteTeam
} = require("../controllers/internController");

const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", authenticateUser, addIntern);
router.get("/", authenticateUser, getAllInterns);
router.get("/attendance-stats", authenticateUser, getAttendanceStats);
router.post("/mark-attendance/:id", authenticateUser, markAttendance);
router.put("/update-attendance/:id", authenticateUser, updateAttendance);
router.post("/assign-to-team", authenticateUser, assignToTeam);

router.get("/:id", authenticateUser, getInternById);
router.put("/update/:id", authenticateUser, updateIntern);
router.delete("/:id", authenticateUser, removeIntern);

router.post("/upload", authenticateUser, upload.single("file"), uploadInterns); 
router.get("/teams/all", authenticateUser, getAllTeams);
router.put("/teams/:oldTeamName", authenticateUser, updateTeamName);

router.delete("/teams/:teamName", authenticateUser, deleteTeam);

router.put("/teams/:teamName/assign-single", authenticateUser, assignSingleToTeam);

router.put("/teams/:teamName/remove", authenticateUser, removeFromTeam);

module.exports = router;
