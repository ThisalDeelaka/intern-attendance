const InternRepository = require("../repositories/internRepository");

class InternService {
  async addIntern(data) {
    return await InternRepository.addIntern(data);
  }

  async getAllInterns() {
    return await InternRepository.getAllInterns();
  }

  async getInternById(internId) {
    return await InternRepository.getInternById(internId);
  }

  async getAttendanceStats() {
    return await InternRepository.getAttendanceStats();
  }

  async markAttendance(internId, status) {
    return await InternRepository.markAttendance(internId, status);
  }

  async updateAttendance(internId, date, status) {
    return await InternRepository.updateAttendance(internId, date, status);
  }

  async assignToTeam(internIds, teamName) {
    return await InternRepository.assignToTeam(internIds, teamName);
  }

  async removeFromTeam(internId) {
    return await InternRepository.removeFromTeam(internId);
  }

  async removeIntern(internId) {
    return await InternRepository.removeIntern(internId);
  }

  async updateIntern(internId, data) {
    return await InternRepository.updateIntern(internId, data);
  }
  
  
}

module.exports = new InternService();
