import { useEffect, useState } from "react";
import { fetchInterns, fetchAttendanceStats } from "../api/internApi";
import DashboardCard from "../components/DashboardCard";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [internCount, setInternCount] = useState(0);
  const [attendanceStats, setAttendanceStats] = useState({ present: 0, absent: 0 });
  const [recentInterns, setRecentInterns] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const interns = await fetchInterns();
        const stats = await fetchAttendanceStats();
        setInternCount(interns.length);
        setAttendanceStats(stats);
        setRecentInterns(interns.slice(-5)); // Show last 5 added interns
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 bg-white">
        <Navbar />
        <div className="p-10">
          <h2 className="text-4xl font-semibold text-gray-900 mb-10">Dashboard Overview</h2>

          {/* Stats Cards (Grid Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <DashboardCard title="Total Interns" count={internCount} color="bg-blue-600" />
            <DashboardCard title="Present Today" count={attendanceStats.present} color="bg-green-600" />
            <DashboardCard title="Absent Today" count={attendanceStats.absent} color="bg-red-600" />
          </div>

          {/* Recent Interns Section */}
          <div className="bg-white shadow-lg rounded-xl p-8 mt-10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Recent Interns</h3>
            <ul className="space-y-4">
              {recentInterns.map((intern) => (
                <li key={intern.traineeId} className="flex items-center space-x-4 border-b pb-4">
                  <div className="flex-1">
                    <p className="text-lg font-medium text-gray-800">{intern.traineeName}</p>
                    <p className="text-sm text-gray-600">{intern.group} - {intern.team}</p>
                  </div>
                  <Link to={`/intern/${intern.traineeId}`} className="text-blue-600 hover:text-blue-800">View Details</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
