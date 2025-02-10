import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation hook
import { BellIcon, UserCircleIcon } from '@heroicons/react/outline'; // Tailwind icons

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation(); // Get current route using useLocation hook

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to apply underline when active with custom green color
  const isActive = (path) => location.pathname === path ? 'border-b-2 border-[#4FB846]' : '';

  return (
    <nav className="bg-[#0D103A] text-white p-4 shadow-md">
      <div className="flex items-center">
        {/* Removed Logo Placeholder */}

        {/* Links */}
        <div className="ml-auto flex items-center space-x-6"> {/* Align links to the right */}
          {/* Dashboard Link */}
          <Link 
            to="/" 
            className={`hover:text-[#4FB846] ${isActive('/')} pb-1`}
          >
            Dashboard
          </Link>
          {/* Intern Page Link */}
          <Link 
            to="/interns" 
            className={`hover:text-[#4FB846] ${isActive('/interns')} pb-1`}
          >
            Intern Page
          </Link>
          {/* Attendance Overview Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className={`hover:text-[#4FB846] ${isActive('/attendance')} pb-1`}
            >
              Attendance Overview
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg">
                <Link to="/attendance/current" className="block px-4 py-2 hover:bg-gray-100">Current Attendance</Link>
                <Link to="/attendance/history" className="block px-4 py-2 hover:bg-gray-100">Past Attendance</Link>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by Name or ID"
            value={searchTerm}
            onChange={handleSearchChange}
            className="px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
          />

          {/* Notifications */}
          <div className="relative">
            <BellIcon className="h-6 w-6 cursor-pointer hover:text-[#4FB846]" />
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              className="flex items-center space-x-2 hover:text-[#4FB846]"
            >
              <UserCircleIcon className="h-6 w-6" />
              <span>User</span>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <Link to="/logout" className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
