import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, UploadIcon, CogIcon, SupportIcon } from '@heroicons/react/outline';
import logo from '../assets/slt logo.jpg';

const Sidebar = () => {
  const [isInternMenuOpen, setIsInternMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'bg-[#4FB846] text-black' : 'text-gray-400';

  return (
    <div className="w-full md:w-64 bg-[#0D103A] text-white h-screen flex flex-col sticky top-0">
      {/* Sidebar Header */}
      <div className="flex items-center justify-center p-4 bg-[#0D103A] text-2xl font-bold">
        <img src={logo} alt="SLT Logo" className="h-24 w-24 object-contain md:h-40 md:w-40" />
      </div>

      {/* Sidebar Links */}
      <div className="flex flex-col space-y-4 p-4">
        <Link to="/" className={`flex items-center space-x-2 p-2 rounded-md hover:bg-[#4FB846] ${isActive('/')} pb-1`}>
          <HomeIcon className="h-6 w-6" />
          <span>Dashboard</span>
        </Link>

        <div>
          <button 
            onClick={() => setIsInternMenuOpen(!isInternMenuOpen)} 
            className={`flex items-center space-x-2 p-2 rounded-md hover:bg-[#4FB846] ${isActive('/interns')} pb-1`}
          >
            <UserGroupIcon className="h-6 w-6" />
            <span>Intern Management</span>
          </button>

          {isInternMenuOpen && (
            <div className="ml-6 flex flex-col space-y-2">
              <Link to="/upload" className={`flex items-center space-x-2 p-2 rounded-md hover:bg-[#4FB846] text-gray-300`}>
                <UploadIcon className="h-5 w-5" />
                <span>Upload CSV</span>
              </Link>
            </div>
          )}
        </div>

        <Link to="/settings" className={`flex items-center space-x-2 p-2 rounded-md hover:bg-[#4FB846] ${isActive('/settings')} pb-1`}>
          <CogIcon className="h-6 w-6" />
          <span>Settings</span>
        </Link>

        <Link to="/help" className={`flex items-center space-x-2 p-2 rounded-md hover:bg-[#4FB846] ${isActive('/help')} pb-1`}>
          <SupportIcon className="h-6 w-6" />
          <span>Help/Support</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
