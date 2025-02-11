import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Import autoTable plugin

const InternsPage = () => {
  const [interns, setInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page

  // Fetch interns and attendance data
  const fetchInterns = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/interns");
      setInterns(response.data);
    } catch (error) {
      console.error("Error fetching interns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  // Function to update attendance status
  const handleMarkAttendance = async (id, status) => {
    try {
      await axios.post(`http://localhost:5000/api/interns/mark-attendance/${id}`, { status });

      // Update the UI immediately
      setInterns((prevInterns) =>
        prevInterns.map((intern) =>
          intern._id === id
            ? {
                ...intern,
                attendance: [{ status }], // Updating attendance status immediately
              }
            : intern
        )
      );
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  // Extract unique Field of Specialization for dropdown
  const uniqueSpecializations = [...new Set(interns.map((i) => i.fieldOfSpecialization))];

  // Get current interns based on page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInterns = interns.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to generate and download the PDF
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add company name and logo
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185); // Set a professional blue color
    doc.text("SLTMobitel", 14, 20); // Company name

    // Add current date
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Date: ${currentDate}`, 14, 30);

    // Add sorting/filtering information
    let sortingInfo = `Sorted by: ${selectedSpecialization || "None"} - Team: ${searchTeam || "All Teams"}`;
    if (searchTerm) {
      sortingInfo += ` - Search Term: ${searchTerm}`;
    }
    doc.setFontSize(10);
    doc.text(sortingInfo, 14, 40);

    // Add report title
    doc.setFontSize(16);
    doc.text("Intern Attendance Report", 14, 50);

    // Add table headers
    const headers = [["Trainee ID", "Name", "Field of Specialization", "Team", "Attendance"]];
    
    // Prepare table data
    const filteredInterns = interns
      .filter(
        (intern) =>
          (intern.traineeId.includes(searchTerm) ||
            intern.traineeName.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (selectedSpecialization === "" || intern.fieldOfSpecialization === selectedSpecialization) &&
          intern.team.toLowerCase().includes(searchTeam.toLowerCase())
      )
      .map((intern) => [
        intern.traineeId,
        intern.traineeName,
        intern.fieldOfSpecialization,
        intern.team,
        intern.attendance.length
          ? intern.attendance[intern.attendance.length - 1].status
          : "Not Marked",
      ]);

    // Use autoTable to create the table inside the PDF
    doc.autoTable({
      head: headers,
      body: filteredInterns,
      startY: 60, // Start below the title and info
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      bodyStyles: { fillColor: [242, 242, 242] },
    });

    // Save the generated PDF
    doc.save("intern-attendance-report.pdf");
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Intern Attendance</h2>

        {/* Search Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by Trainee ID or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          />
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">All Specializations</option>
            {uniqueSpecializations.map((spec, index) => (
              <option key={index} value={spec}>
                {spec}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search by Team"
            value={searchTeam}
            onChange={(e) => setSearchTeam(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
          />
        </div>

        {/* PDF Download Button */}
        <div className="mb-4">
          <button
            onClick={generatePDF}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Download PDF
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-xl text-gray-600">Loading interns...</div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg bg-white">
            <table className="w-full border-collapse table-auto">
              <thead className="bg-gray-100">
                <tr className="text-left text-sm text-gray-600">
                  <th className="p-4">Trainee ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Field of Specialization</th>
                  <th className="p-4">Team</th>
                  <th className="p-4 text-center">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {currentInterns
                  .filter(
                    (intern) =>
                      (intern.traineeId.includes(searchTerm) ||
                        intern.traineeName.toLowerCase().includes(searchTerm.toLowerCase())) &&
                      (selectedSpecialization === "" || intern.fieldOfSpecialization === selectedSpecialization) &&
                      intern.team.toLowerCase().includes(searchTeam.toLowerCase())
                  )
                  .map((intern) => {
                    const lastAttendance = intern.attendance.length
                      ? intern.attendance[intern.attendance.length - 1].status
                      : null;

                    return (
                      <tr key={intern._id} className="hover:bg-gray-50 transition-all">
                        <td className="p-4 border-b">{intern.traineeId}</td>
                        <td className="p-4 border-b">{intern.traineeName}</td>
                        <td className="p-4 border-b">{intern.fieldOfSpecialization}</td>
                        <td className="p-4 border-b">{intern.team}</td>
                        <td className="p-4 border-b text-center">
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => handleMarkAttendance(intern._id, "Present")}
                              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                lastAttendance === "Present"
                                  ? "bg-green-300 text-gray-600 cursor-not-allowed"
                                  : "bg-green-500 text-white hover:bg-green-600"
                              }`}
                              disabled={lastAttendance === "Present"}
                            >
                              ✅ Present
                            </button>
                            <button
                              onClick={() => handleMarkAttendance(intern._id, "Absent")}
                              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                lastAttendance === "Absent"
                                  ? "bg-red-300 text-gray-600 cursor-not-allowed"
                                  : "bg-red-500 text-white hover:bg-red-600"
                              }`}
                              disabled={lastAttendance === "Absent"}
                            >
                              ❌ Absent
                            </button>
                          </div>
                          {lastAttendance && (
                            <p className="mt-2 text-xs text-gray-600">
                              Last Marked:{" "}
                              <span className={`${lastAttendance === "Present" ? "text-green-600" : "text-red-600"}`}>
                                {lastAttendance}
                              </span>
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(interns.length / itemsPerPage)}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(interns.length / itemsPerPage)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternsPage;
