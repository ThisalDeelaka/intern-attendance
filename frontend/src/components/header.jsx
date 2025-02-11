import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-blue-100 border-b shadow-md px-6 lg:px-12 py-3 lg:py-4 backdrop-blur-sm">
      {/* Center Section - Date */}
      <div className="flex space-x-4 lg:space-x-6 items-center">
        <span className="font-semibold text-gray-600 text-sm md:text-lg">
          {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Right Section - Buttons and User Profile */}
      <div className="flex space-x-4 lg:space-x-6 items-center">
        {/* View Interns Button */}
        <Link
          to="/interns"
          className="flex items-center bg-blue-600 text-white text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        >
          <IoIosPeople className="mr-1 md:mr-2 text-base md:text-lg" />
          <span className="hidden sm:inline">View Interns</span>
        </Link>

        {/* Upload CSV Button */}
        <Link
          to="/upload"
          className="bg-green-600 text-white text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-green-700 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
        >
          Upload CSV
        </Link>

        {/* Today Button */}
        <button className="flex items-center bg-gray-100 text-gray-600 text-sm md:text-base px-3 md:px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200 ease-in-out">
          <FaCalendarAlt className="mr-1 md:mr-2 text-blue-600 text-sm md:text-lg" />
          Today
        </button>
      </div>
    </div>
  );
};

export default Navbar;
