import { useEffect, useState } from "react"; 
import axios from "axios"; 
import Sidebar from "../components/Sidebar";

const InternsPage = () => {
  const [interns, setInterns] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

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
    fetchInterns(); // Fetch data on component mount
  }, []);

  const handleMarkAttendance = async (id, status) => {
    try {
      await axios.post(`http://localhost:5000/api/interns/mark-attendance/${id}`, { status });
      fetchInterns(); // Refresh the intern list after marking attendance
    } catch (error) {
      console.error("Error marking attendance:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">Intern Attendance</h2>

        {/* Search Input */}
        <div className="mb-6 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Search by name, group..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500"
          />
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
                  <th className="p-4">Group</th>
                  <th className="p-4">Team</th>
                  <th className="p-4 text-center">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {interns
                  .filter((intern) =>
                    intern.traineeName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((intern) => {
                    const lastAttendance = intern.attendance.length
                      ? intern.attendance[intern.attendance.length - 1].status
                      : null;

                    return (
                      <tr key={intern._id} className="hover:bg-gray-50 transition-all">
                        <td className="p-4 border-b">{intern.traineeId}</td>
                        <td className="p-4 border-b">{intern.traineeName}</td>
                        <td className="p-4 border-b">{intern.group}</td>
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
                              Present
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
                              Absent
                            </button>
                          </div>
                          {/* Last Attendance */}
                          {lastAttendance && (
                            <p className="mt-2 text-xs text-gray-600">
                              Last Marked:{" "}
                              <span
                                className={`${
                                  lastAttendance === "Present" ? "text-green-600" : "text-red-600"
                                }`}
                              >
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
      </div>
    </div>
  );
};

export default InternsPage;
