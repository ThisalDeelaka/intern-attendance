import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Pencil, X, CheckCircle, Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import { api, getAuthHeaders } from "../api/apiConfig";

const AttendanceOverviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intern, setIntern] = useState(null);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedSpecialization, setEditedSpecialization] = useState("");
  const [specializations, setSpecializations] = useState([]); // State to hold specializations
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedDate, setSelectedDate] = useState(""); // To manage selected date
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const rowsPerPage = 10; // Number of rows per page

  // Fetch intern data on component mount
  useEffect(() => {
    const fetchInternData = async () => {
      try {
        const response = await api.get(`/interns/${id}`, getAuthHeaders());
        setIntern(response.data);
        setAttendanceHistory(response.data.attendance);
        setFilteredAttendance(response.data.attendance); // Initialize filteredAttendance
        setEditedName(response.data.traineeName);
        setEditedSpecialization(response.data.fieldOfSpecialization);
        setLoading(false);

        // Fetch specializations from the list of interns
        const allInterns = await api.get("/interns", getAuthHeaders());
        const uniqueSpecializations = Array.from(
          new Set(allInterns.data.map((intern) => intern.fieldOfSpecialization))
        ).sort();
        setSpecializations(uniqueSpecializations);
      } catch (error) {
        console.error("Error fetching intern data:", error);
        toast.error("Access denied! Please log in.");
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchInternData();
  }, [id, navigate]);

  // Handle changing attendance status (Present/Absent)
  const handleStatusChange = async (date, currentStatus) => {
    const newStatus = currentStatus === "Present" ? "Absent" : "Present";
    try {
      const response = await api.put(
        `/interns/update-attendance/${intern._id}`,
        { date, status: newStatus },
        getAuthHeaders()
      );

      if (response.status === 200) {
        const updatedAttendance = attendanceHistory.map((entry) =>
          new Date(entry.date).toLocaleDateString() === new Date(date).toLocaleDateString()
            ? { ...entry, status: newStatus }
            : entry
        );
        setAttendanceHistory(updatedAttendance);
        setFilteredAttendance(updatedAttendance); // Update filtered list as well
        toast.success(`Attendance updated to ${newStatus} on ${new Date(date).toLocaleDateString()}.`);
      }
    } catch (error) {
      toast.error("Error updating attendance.");
    }
  };

  // Handle removing intern
  const handleRemoveIntern = async () => {
    const confirmRemove = window.confirm("Are you sure you want to remove this intern?");
    if (!confirmRemove) return;

    setDeleting(true);
    try {
      const response = await api.delete(`/interns/${intern._id}`, getAuthHeaders());
      if (response.status === 200) {
        toast.success("Intern removed successfully.");
        navigate("/interns");
      } else {
        toast.error("Error removing intern.");
      }
    } catch (error) {
      toast.error("Error removing intern.");
    }
    setDeleting(false);
  };

  // Handle saving profile changes
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const response = await api.put(
        `/interns/update/${intern._id}`,
        { traineeName: editedName, fieldOfSpecialization: editedSpecialization },
        getAuthHeaders()
      );

      if (response.status === 200) {
        setIntern({ ...intern, traineeName: editedName, fieldOfSpecialization: editedSpecialization });
        toast.success("Intern profile updated successfully.");
        setIsModalOpen(false);
      } else {
        toast.error("Error updating profile.");
      }
    } catch (error) {
      toast.error("Error updating profile.");
    }
    setSaving(false);
  };

  // Filter attendance by status (Present/Absent/All)
  const handleFilterByStatus = (status) => {
    if (status === "All") {
      setFilteredAttendance(attendanceHistory); // Show all
    } else {
      setFilteredAttendance(attendanceHistory.filter(entry => entry.status === status)); // Filter by Present/Absent
    }
  };

  // Select a date and show that specific day's attendance (or show toast if not found)
  const handleDateSelection = (date) => {
    setSelectedDate(date); // Update the selected date

    const foundEntry = attendanceHistory.find(
      entry => new Date(entry.date).toLocaleDateString() === new Date(date).toLocaleDateString()
    );

    if (foundEntry) {
      setFilteredAttendance([foundEntry]); // Show only this entry
    } else {
      toast.error("Attendance not marked for this day.");
      setFilteredAttendance([]); // Clear if not found
    }
  };

  // Clear the selected date and show all attendance
  const clearDateSelection = () => {
    setSelectedDate(""); // Reset selected date
    setFilteredAttendance(attendanceHistory); // Show all
  };

  // Slice attendance for pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredAttendance.slice(indexOfFirstRow, indexOfLastRow);

  // Change page
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold text-gray-800">{intern.traineeName}'s Attendance Overview</h2>
          <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all">
            <Pencil size={18} /> Edit Profile
          </button>
        </div>

        <button
          onClick={handleRemoveIntern}
          className={`bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 ${deleting ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={deleting}
        >
          {deleting ? "Removing..." : "Remove Intern"}
        </button>

        {/* Filter and Date Selection in one row */}
        <div className="mt-4 flex gap-4 items-center">
          {/* Attendance Filter */}
          <select onChange={(e) => handleFilterByStatus(e.target.value)} className="p-2 border rounded-md text-sm w-32">
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>

          {/* Date Picker with Clear Option */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateSelection(e.target.value)}
              className="p-2 border rounded-md text-sm"
            />
            <button
              onClick={clearDateSelection}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Clear Date"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto shadow-md rounded-lg bg-white mt-6">
          <table className="w-full border-collapse table-auto">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((entry) => (
                <tr key={entry.date} className="hover:bg-gray-50 transition-all">
                  <td className="p-4 border-b">{new Date(entry.date).toLocaleDateString()}</td>
                  <td className="p-4 border-b">{entry.status}</td>
                  <td className="p-4 border-b text-center">
                    <button onClick={() => handleStatusChange(entry.date, entry.status)} className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600">
                      {entry.status === "Present" ? "Mark Absent" : "Mark Present"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(filteredAttendance.length / rowsPerPage)}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredAttendance.length / rowsPerPage)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Edit Profile Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <label className="block mb-2">Trainee Name:</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full border p-2 rounded-md mb-3"
              />
              <label className="block mb-2">Field of Specialization:</label>
              <select
                value={editedSpecialization}
                onChange={(e) => setEditedSpecialization(e.target.value)}
                className="w-full border p-2 rounded-md mb-3"
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec, idx) => (
                  <option key={idx} value={spec}>{spec}</option>
                ))}
              </select>
              <div className="flex justify-between">
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500">Cancel</button>
                <button onClick={handleSaveChanges} disabled={saving} className="bg-green-500 text-white px-4 py-2 rounded-lg">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AttendanceOverviewPage;
