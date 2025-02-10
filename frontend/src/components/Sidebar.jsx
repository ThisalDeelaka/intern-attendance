import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // For navigation
import { HomeIcon, UserGroupIcon, UploadIcon, CogIcon, SupportIcon } from '@heroicons/react/outline'; // Tailwind icons
import logo from '../assets/slt logo.jpg'; // Import the logo from the assets folder

const Sidebar = () => {
  const [isInternMenuOpen, setIsInternMenuOpen] = useState(false);
  const location = useLocation(); // Get current route using useLocation hook

  // Function to apply green highlight for active links and change text color to black
  const isActive = (path) => location.pathname === path ? 'bg-[#4FB846] text-black' : 'text-gray-400';

  return (
    <div className="w-64 bg-[#0D103A] text-white h-screen flex flex-col sticky top-0"> {/* Sticky Sidebar */}
      {/* Sidebar Header */}
      <div className="flex items-center justify-center p-4 bg-[#0D103A] text-2xl font-bold">
        <img src={logo} alt="SLT Logo" className="h-40 w-40 object-contain" /> {/* Adjusted logo size */}
      </div>

      {/* Sidebar Links */}
      <div className="flex flex-col space-y-4 p-4">
        {/* Dashboard Link */}
        <Link to="/" className={`flex items-center space-x-2 p-2 rounded-md hover:bg-[#4FB846] ${isActive('/')} pb-1`}>
          <HomeIcon className="h-6 w-6" />
          <span>Dashboard</span>
        </Link>

        {/* Intern Management Section */}
        <div>
          <button 
            onClick={() => setIsInternMenuOpen(!isInternMenuOpen)} 
            className={`flex items-center space-x-2 p-2 rounded-md hover:bg-[#4FB846] ${isActive('/interns')} pb-1`}
          >
            <UserGroupIcon className="h-6 w-6" />
            <span>Intern Management</span>
          </button>

          {/* Submenu for Upload CSV */}
          {isInternMenuOpen && (
            <div className="ml-6 flex flex-col space-y-2">
              <Link to="/upload" className={`flex items-center space-x-2 p-2 rounded-md hover:bg-[#4FB846] text-gray-300`}>
                <UploadIcon className="h-5 w-5" />
                <span>Upload CSV</span>
              </Link>
            </div>
          )}
        </div>

        {/* Settings Link */}
        <Link to="/settings" className={`flex items-center space-x-2 p-2 rounded-md hover:bg-[#4FB846] ${isActive('/settings')} pb-1`}>
          <CogIcon className="h-6 w-6" />
          <span>Settings</span>
        </Link>

        {/* Help/Support Link */}
        <Link to="/help" className={`flex items-center space-x-2 p-2 rounded-md hover:bg-[#4FB846] ${isActive('/help')} pb-1`}>
          <SupportIcon className="h-6 w-6" />
          <span>Help/Support</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
