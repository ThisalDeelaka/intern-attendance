const Intern = require("../models/Intern");

class InternRepository {
  
  static async addIntern(data) {
    const intern = new Intern(data);
    return await intern.save();
  }

  
  static async getAllInterns() {
    return await Intern.find();
  }

  
  static async getInternById(internId) {
    return await Intern.findById(internId);
  }

  
  static async getAttendanceStats() {
    const interns = await Intern.find();
    const stats = { present: 0, absent: 0 };

    interns.forEach((intern) => {
      if (intern.attendance.length > 0) {
        const latestAttendance = intern.attendance[intern.attendance.length - 1];
        if (latestAttendance.status === "Present") {
          stats.present++;
        } else {
          stats.absent++;
        }
      }
    });

    return stats;
  }

  
  static async markAttendance(internId, status) {
    const intern = await Intern.findById(internId);
    if (!intern) throw new Error("Intern not found");

    const today = new Date().setHours(0, 0, 0, 0);
    const existingAttendance = intern.attendance.find(
      (a) => new Date(a.date).setHours(0, 0, 0, 0) === today
    );

    if (existingAttendance) {
      existingAttendance.status = status;
    } else {
      intern.attendance.push({ date: new Date(), status });
    }

    return await intern.save();
  }

  
  static async updateAttendance(internId, date, status) {
    const intern = await Intern.findById(internId);
    if (!intern) throw new Error("Intern not found");

    const attendanceIndex = intern.attendance.findIndex(
      (entry) => new Date(entry.date).setHours(0, 0, 0, 0) === new Date(date).setHours(0, 0, 0, 0)
    );

    if (attendanceIndex !== -1) {
      intern.attendance[attendanceIndex].status = status;
    } else {
      intern.attendance.push({ date: new Date(date), status });
    }

    return await intern.save();
  }

  
  static async assignToTeam(internIds, teamName) {
    return await Intern.updateMany({ _id: { $in: internIds } }, { $set: { team: teamName } });
  }

  
  static async removeFromTeam(internId) {
    return await Intern.findByIdAndUpdate(internId, { team: "" }, { new: true });
  }

  static async removeIntern(internId) {
    return await Intern.findByIdAndDelete(internId);
  }
  
  static async updateIntern(internId, data) {
    return await Intern.findByIdAndUpdate(internId, data, { new: true });
  }
  
  static async getAllTeams() {
    return await Intern.aggregate([
      { $match: { team: { $ne: "" } } },
      { $group: { _id: "$team" } },
      { $project: { _id: 0, name: "$_id" } }
    ]);
  }

  static async updateTeamName(oldTeamName, newTeamName) {
    const result = await Intern.updateMany(
      { team: oldTeamName },
      { $set: { team: newTeamName } }
    );
    return {
      modifiedCount: result.modifiedCount,
      message: `Successfully updated ${result.modifiedCount} interns from ${oldTeamName} to ${newTeamName}`
    };
  }

}

module.exports = InternRepository;
