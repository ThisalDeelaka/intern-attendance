import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import InternsPage from "../pages/InternsPage";
import UploadCSV from "../pages/UploadCSV";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AttendanceOverviewPage from "../pages/AttendanceOverviewPage";
import GroupPage from "../pages/GroupPage";
import AddIntern from "../pages/AddIntern";
import GroupOverview from "../pages/GroupOverview";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/interns" element={<InternsPage />} />
        <Route path="/upload" element={<UploadCSV />} />
        <Route path="/attendance/:id" element={<AttendanceOverviewPage />} /> 
        <Route path="/groups" element={<GroupPage />} />
        <Route path="/add-intern" element={<AddIntern />} />
        <Route path="/teams" element={<GroupOverview />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
