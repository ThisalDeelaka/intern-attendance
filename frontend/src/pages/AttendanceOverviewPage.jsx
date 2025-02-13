import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Correct import for Toastify CSS
import { useParams, useNavigate } from "react-router-dom";  // Import useNavigate for redirecting

const AttendanceOverviewPage = () => {
  const { id } = useParams();  // Get the intern ID from the URL
  const navigate = useNavigate();  // Initialize useNavigate for redirection
  const [intern, setIntern] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/interns/${id}`);
        setIntern(response.data);
        setAttendanceHistory(response.data.attendance);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching intern data:", error);
      }
    };

    fetchInternData();
  }, [id]);

  const handleStatusChange = async (date, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/interns/update-attendance/${intern._id}`, {
        date,
        status: newStatus
      });

      const updatedAttendance = attendanceHistory.map((entry) =>
        entry.date.toISOString().split("T")[0] === date ? { ...entry, status: newStatus } : entry
      );
      setAttendanceHistory(updatedAttendance);

      toast.success(`Attendance for ${newStatus} on ${date} updated.`);
    } catch (error) {
      toast.error("Error updating attendance.");
    }
  };

  const handleRemoveIntern = async () => {
    const confirmRemove = window.confirm("Are you sure you want to remove this intern? This action cannot be undone.");
    if (!confirmRemove) {
      return; // Stop the deletion if the user doesn't confirm
    }

    try {
      await axios.delete(`http://localhost:5000/api/interns/${intern._id}`);
      toast.success("Intern removed successfully.");
      
      // Redirect to /interns page after successful removal
      navigate("/interns");
    } catch (error) {
      toast.error("Error removing intern.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800">{intern.traineeName}'s Attendance Overview</h2>

        <button
          onClick={handleRemoveIntern}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Remove Intern
        </button>

        <div className="overflow-x-auto shadow-md rounded-lg bg-white">
          <table className="w-full border-collapse table-auto">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceHistory.map((entry) => (
                <tr key={entry.date} className="hover:bg-gray-50 transition-all">
                  <td className="p-4 border-b">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="p-4 border-b">{entry.status}</td>
                  <td className="p-4 border-b text-center">
                    <button
                      onClick={() => handleStatusChange(entry.date, entry.status === "Present" ? "Absent" : "Present")}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default AttendanceOverviewPage;
