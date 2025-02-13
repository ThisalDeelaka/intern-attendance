import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";

const InternsPage = () => {
  const [interns, setInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTeam, setSearchTeam] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); 
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Use useNavigate hook for navigation

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

  const filteredInterns = interns.filter(
    (intern) =>
      (intern.traineeId.includes(searchTerm) ||
        intern.traineeName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSpecialization === "" || intern.fieldOfSpecialization === selectedSpecialization) &&
      intern.team.toLowerCase().includes(searchTeam.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInterns = filteredInterns.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    if (pageNumber < 1) return;
    if (pageNumber > Math.ceil(filteredInterns.length / itemsPerPage)) return;
    setCurrentPage(pageNumber);
  };

  const handleSort = (sortField) => {
    // Sorting logic here (if needed)
    setCurrentPage(1);
  };

  const handleMarkAttendance = async (id, status) => {
    try {
      await axios.post(`http://localhost:5000/api/interns/mark-attendance/${id}`, { status });
  
      setInterns((prevInterns) =>
        prevInterns.map((intern) =>
          intern._id === id
            ? {
                ...intern,
                attendance: intern.attendance.map(entry => {
                  const entryDate = new Date(entry.date);
                  entryDate.setHours(0, 0, 0, 0);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (entryDate.getTime() === today.getTime()) {
                    return { ...entry, status };
                  }
                  return entry;
                }),
              }
            : intern
        )
      );
      toast.success(`Attendance marked as ${status}`);
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };
  

  const uniqueSpecializations = [...new Set(interns.map((i) => i.fieldOfSpecialization))];

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185); 
    doc.text("SLTMobitel", 14, 20); 

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

    doc.setFontSize(16);
    doc.text("Intern Attendance Report", 14, 50);

    const headers = [["Trainee ID", "Name", "Field of Specialization", "Team", "Attendance"]];

    const filteredInternsForPDF = filteredInterns.map((intern) => [
      intern.traineeId,
      intern.traineeName,
      intern.fieldOfSpecialization,
      intern.team,
      intern.attendance.length
        ? intern.attendance[intern.attendance.length - 1].status
        : "Not Marked",
    ]);

    doc.autoTable({
      head: headers,
      body: filteredInternsForPDF,
      startY: 60, 
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      bodyStyles: { fillColor: [242, 242, 242] },
    });

    doc.save("intern-attendance-report.pdf");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post("http://localhost:5000/api/interns/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
  
      // Directly update interns state with the newly added interns
      const newInterns = response.data.newInterns; // Assuming the server sends the added interns in response
      setInterns((prevInterns) => [...prevInterns, ...newInterns]); // Append the new interns
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("Error uploading file.");
    }
  };
  

  // Handle row click to navigate to Attendance Overview
  const handleRowClick = (internId) => {
    navigate(`/attendance/${internId}`); // Use navigate to redirect to the Attendance Overview page
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Intern Attendance</h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              className="p-3 border-2 border-[#4FB846] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FB846] w-60"
            />
            <button
              onClick={handleUpload}
              className="bg-[#0D103A] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#4FB846] transition duration-300"
            >
              Upload
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder="Search by Trainee ID or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
          />
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
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
            className="p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
          />
          <button
            onClick={generatePDF}
            className="bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
          >
            Download PDF
          </button>
        </div>

        {loading ? (
          <div className="text-center text-xl text-gray-600">Loading interns...</div>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg bg-white">
            <table className="w-full border-collapse table-auto">
              <thead className="bg-gray-100">
                <tr className="text-left text-sm text-gray-600">
                  <th className="p-4" onClick={() => handleSort("traineeId")}>Trainee ID</th>
                  <th className="p-4" onClick={() => handleSort("traineeName")}>Name</th>
                  <th className="p-4" onClick={() => handleSort("fieldOfSpecialization")}>Field of Specialization</th>
                  <th className="p-4" onClick={() => handleSort("team")}>Team</th>
                  <th className="p-4 text-center">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {currentInterns.map((intern) => {
                  const lastAttendance = intern.attendance.length
                    ? intern.attendance[intern.attendance.length - 1].status
                    : null;

                  return (
                    <tr 
                      key={intern._id} 
                      className="hover:bg-gray-50 transition-all cursor-pointer"
                      onClick={() => handleRowClick(intern._id)}  // Row click for navigating
                    >
                      <td className="p-4 border-b">{intern.traineeId}</td>
                      <td className="p-4 border-b">{intern.traineeName}</td>
                      <td className="p-4 border-b">{intern.fieldOfSpecialization}</td>
                      <td className="p-4 border-b">{intern.team}</td>
                      <td className="p-4 border-b text-center">
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={(e) => { 
                              e.stopPropagation();  // Prevent row click from being triggered
                              handleMarkAttendance(intern._id, "Present");
                            }}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                              lastAttendance === "Present"
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-green-300 text-gray-600 hover:bg-green-400"
                            }`}
                          >
                            ✅ Present
                          </button>
                          <button
                            onClick={(e) => { 
                              e.stopPropagation();  // Prevent row click from being triggered
                              handleMarkAttendance(intern._id, "Absent");
                            }}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                              lastAttendance === "Absent"
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-red-300 text-gray-600 hover:bg-red-400"
                            }`}
                          >
                            ❌ Absent
                          </button>
                        </div>
                        
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(filteredInterns.length / itemsPerPage)}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredInterns.length / itemsPerPage)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          >
            Next
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default InternsPage;
