import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import InternsPage from "../pages/InternsPage";
import UploadCSV from "../pages/UploadCSV";
import Login from "../pages/Login";
import AttendanceOverviewPage from "../pages/AttendanceOverviewPage";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/interns" element={<InternsPage />} />
        <Route path="/upload" element={<UploadCSV />} />
        <Route path="/attendance/:id" element={<AttendanceOverviewPage />} /> 
      </Routes>
    </Router>
  );
};

export default AppRoutes;
