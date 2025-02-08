const Intern = require('../models/Intern');

class InternService {
  async markAttendance(internId, status) {
    const intern = await Intern.findById(internId);
    if (!intern) throw new Error('Intern not found');

    intern.attendance.push({ status });
    await intern.save();
    return intern;
  }

  // Additional business logic for Intern services can go here...
}

module.exports = new InternService();
