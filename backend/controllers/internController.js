const InternService = require("../services/internService");
const { parseXLSX, addInternsFromXLSX } = require("../utils/xlsxHandler");


const addIntern = async (req, res) => {
  try {
    const newIntern = await InternService.addIntern(req.body);
    res.status(201).json({ message: "Intern added successfully!", intern: newIntern });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getAllInterns = async (req, res) => {
  try {
    const interns = await InternService.getAllInterns();
    res.status(200).json(interns);
  } catch (error) {
    res.status(500).json({ message: "Error fetching interns" });
  }
};


const getInternById = async (req, res) => {
  try {
    const intern = await InternService.getInternById(req.params.id);
    if (!intern) {
      return res.status(404).json({ message: "Intern not found" });
    }
    res.status(200).json(intern);
  } catch (error) {
    res.status(500).json({ message: "Error fetching intern", error: error.message });
  }
};


const getAttendanceStats = async (req, res) => {
  try {
    const stats = await InternService.getAttendanceStats();
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attendance stats" });
  }
};


const markAttendance = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedIntern = await InternService.markAttendance(req.params.id, status);
    res.status(200).json({ message: "Attendance marked successfully", intern: updatedIntern });
  } catch (error) {
    res.status(500).json({ message: "Error marking attendance", error: error.message });
  }
};


const updateAttendance = async (req, res) => {
  try {
    const { date, status } = req.body;
    const updatedIntern = await InternService.updateAttendance(req.params.id, date, status);
    res.status(200).json({ message: "Attendance updated successfully", intern: updatedIntern });
  } catch (error) {
    res.status(500).json({ message: "Error updating attendance", error: error.message });
  }
};


const assignToTeam = async (req, res) => {
  try {
    await InternService.assignToTeam(req.body.internIds, req.body.teamName);
    res.status(200).json({ message: "Interns successfully assigned to the team" });
  } catch (error) {
    res.status(500).json({ message: "Error assigning interns to team", error: error.message });
  }
};



const removeFromTeam = async (req, res) => {
  try {
    const { internId } = req.body;
    const { teamName } = req.params;  

    if (!internId || !teamName) {
      return res.status(400).json({ message: "Intern ID and Team Name are required." });
    }

    const result = await InternService.removeFromTeam(internId);
    if (result) {
      return res.status(200).json({ message: "Intern removed from the team." });
    } else {
      return res.status(404).json({ message: "Intern not found." });
    }
  } catch (error) {
    console.error("Error removing intern:", error);
    res.status(500).json({ message: "Error removing intern from the team" });
  }
};



const removeIntern = async (req, res) => {
  try {
    const deletedIntern = await InternService.removeIntern(req.params.id);
    if (!deletedIntern) {
      return res.status(404).json({ message: "Intern not found" });
    }
    res.status(200).json({ message: "Intern removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing intern", error: error.message });
  }
};


const updateIntern = async (req, res) => {
  try {
    const updatedIntern = await InternService.updateIntern(req.params.id, req.body);
    if (!updatedIntern) {
      return res.status(404).json({ message: "Intern not found" });
    }
    res.status(200).json({ message: "Intern updated successfully", intern: updatedIntern });
  } catch (error) {
    res.status(500).json({ message: "Error updating intern", error: error.message });
  }
};


const uploadInterns = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("📂 File received:", req.file.path);

    const interns = parseXLSX(req.file.path);
    console.log("✅ Parsed Interns:", interns);

    const { addedCount, skippedCount } = await addInternsFromXLSX(interns);

    res.status(201).json({
      message: `Upload Complete: ${addedCount} new interns added, ${skippedCount} duplicates skipped.`,
      addedCount,
      skippedCount,
    });
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    res.status(500).json({ message: "Error processing file", error: error.message });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await InternService.getAllTeams();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teams", error: error.message });
  }
};

const updateTeamName = async (req, res) => {
  try {
    const { oldTeamName } = req.params;
    const { newTeamName } = req.body;
    
    if (!newTeamName) {
      return res.status(400).json({ message: "New team name is required" });
    }

    const result = await InternService.updateTeamName(oldTeamName, newTeamName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error updating team", error: error.message });
  }
};

const assignSingleToTeam = async (req, res) => {
  try {
    const { internId } = req.body;
    const { teamName } = req.params;  // Get team name from URL parameters

    if (!internId || !teamName) {
      return res.status(400).json({ message: "Intern ID and Team Name are required." });
    }

    const result = await InternService.assignSingleToTeam(internId, teamName);
    if (result) {
      return res.status(200).json({ message: "Intern added to the team!" });
    } else {
      return res.status(404).json({ message: "Intern not found." });
    }
  } catch (error) {
    console.error("Error adding intern:", error);
    res.status(500).json({ message: "Error adding intern to the team" });
  }
};


const deleteTeam = async (req, res) => {
  try {
    const result = await InternService.deleteTeam(req.params.teamName);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error deleting team",
      error: error.message,
    });
  }
};


module.exports = {
  addIntern,
  getAllInterns,
  getInternById,
  getAttendanceStats,
  markAttendance,
  updateAttendance,
  assignToTeam,
  removeFromTeam,
  removeIntern,
  updateIntern,
  uploadInterns,
  getAllTeams,
  updateTeamName,
  assignSingleToTeam,
  deleteTeam,
};
