import { useEffect, useState } from "react";
import { fetchInterns, fetchAttendanceStats } from "../api/internApi";
import DashboardCard from "../components/DashboardCard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { Users, CheckCircle, XCircle, User } from "lucide-react";

const Dashboard = () => {
  const [internCount, setInternCount] = useState(0);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0 });
  const [recentInterns, setRecentInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching interns...");
        const interns = await fetchInterns();
        console.log("Interns received:", interns);

        console.log("Fetching attendance stats...");
        const stats = await fetchAttendanceStats();
        console.log("Stats received:", stats);

        setInternCount(interns.length);
        setAttendanceStats(stats);
        setRecentInterns(interns.slice(-5));
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-10">
            <div className="text-center">Loading dashboard data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-10">
            <div className="text-red-500">Error: {error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-10 mt-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">Dashboard Overview</h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <DashboardCard 
              title="Total Interns" 
              count={internCount} 
              color="bg-blue-500" 
              icon={<Users size={50} className="text-blue-600" />} 
            />
            <DashboardCard 
              title="Present Today" 
              count={attendanceStats.present} 
              color="bg-green-500" 
              icon={<CheckCircle size={50} className="text-green-600" />} 
            />
            <DashboardCard 
              title="Absent Today" 
              count={attendanceStats.absent} 
              color="bg-red-500" 
              icon={<XCircle size={50} className="text-red-600" />} 
            />
          </div>

          {/* Recent Interns */}
          <div className="bg-white shadow-lg rounded-2xl p-8 mt-12 border border-gray-200">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              Recent Interns ({recentInterns.length})
            </h3>
            {recentInterns.length === 0 ? (
              <p className="text-gray-500">No interns found</p>
            ) : (
              <ul className="space-y-6">
                {recentInterns.map((intern) => (
                  <li
                    key={intern.traineeId}
                    className="flex items-center space-x-6 border-b border-gray-300 pb-4 hover:bg-gray-100 rounded-xl p-4 transition duration-300"
                  >
                    <div className="bg-gray-300 p-4 rounded-full shadow-md">
                      <User className="w-12 h-12 text-gray-900" />
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-medium text-gray-800">{intern.traineeName}</p>
                      <p className="text-sm text-gray-500">
                        {intern.fieldOfSpecialization} - {intern.team || 'No Team'}
                      </p>
                    </div>
                    <Link
                      to={`/attendance/${intern._id}`}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-400 transition duration-300 rounded-xl text-white font-semibold"
                    >
                      View Details
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;