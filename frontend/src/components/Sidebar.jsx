import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineUserGroup, HiOutlineDocumentText, HiOutlineClipboardList, HiOutlineCalendar, HiOutlineBell, HiOutlineViewGrid } from "react-icons/hi";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 border-r shadow-lg p-6 flex flex-col sticky top-0 z-10">
      {/* Branding */}
      <div className="text-3xl font-bold text-blue-600 mb-8">
        SLTMobitel
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 space-y-8">
        <div>
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-4 tracking-wider">Realtime</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="flex items-center text-gray-600 hover:text-blue-600 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-50">
                <HiOutlineViewGrid className="mr-3" /> Overview
              </Link>
            </li>
            <li>
              <Link to="/my-team" className="flex items-center text-gray-600 hover:text-blue-600 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-50">
                <HiOutlineUserGroup className="mr-3" /> My Team
              </Link>
            </li>
          </ul>
        </div>

        {/* Other Sections */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-4 tracking-wider">Proof of Work</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/screenshots" className="flex items-center text-gray-600 hover:text-blue-600 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-50">
                <HiOutlineClipboardList className="mr-3" /> Screenshots
              </Link>
            </li>
            <li>
              <Link to="/timelapse-videos" className="flex items-center text-gray-600 hover:text-blue-600 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-50">
                <HiOutlineDocumentText className="mr-3" /> Timelapse Videos
              </Link>
            </li>
            <li>
              <Link to="/timesheet" className="flex items-center text-gray-600 hover:text-blue-600 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-50">
                <HiOutlineClipboardList className="mr-3" /> Timesheet
              </Link>
            </li>
          </ul>
        </div>

        {/* Leave Management Section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-600 uppercase mb-4 tracking-wider">Leave Management</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/apply-leave" className="flex items-center text-gray-600 hover:text-blue-600 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-50">
                <HiOutlineCalendar className="mr-3" /> Apply Leave
              </Link>
            </li>
            <li>
              <Link to="/leave-summary" className="flex items-center text-gray-600 hover:text-blue-600 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-50">
                <HiOutlineCalendar className="mr-3" /> Leave Summary
              </Link>
            </li>
            <li>
              <Link to="/manage-leave" className="flex items-center text-gray-600 hover:text-blue-600 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-50">
                <HiOutlineCalendar className="mr-3" /> Manage Leave
              </Link>
            </li>
            <li>
              <Link to="/manage-holiday" className="flex items-center text-gray-600 hover:text-blue-600 py-2 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-blue-50">
                <HiOutlineCalendar className="mr-3" /> Manage Holiday
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
