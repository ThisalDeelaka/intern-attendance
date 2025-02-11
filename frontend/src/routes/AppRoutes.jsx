import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import InternsPage from "../pages/InternsPage";
import Home from "../pages/Home";
import UploadCSV from "../pages/UploadCSV";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/interns" element={<InternsPage />} />
        <Route path="/upload" element={<UploadCSV />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
