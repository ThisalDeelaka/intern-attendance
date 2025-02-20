import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, User, Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Use the useNavigate hook

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const isActive = (path) => 
    location.pathname === path ? 'border-b-2 border-[#4FB846] text-[#4FB846]' : '';

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/interns', label: 'Intern Page' },
    { path: '/teams', label: 'Team Overview' },
  ];

  const handleLogout = () => {
    // Clear the token (or any other authentication data from localStorage)
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav className="bg-[#00102F] text-white fixed top-0 right-0 w-[calc(100%-256px)] ml-64 p-7 z-40">
      <div className="max-w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors duration-200 hover:text-[#4FB846] ${isActive(
                  link.path
                )} py-2`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 rounded-full bg-[#001845] text-white focus:outline-none focus:ring-2 focus:ring-[#4FB846] transition-all duration-200 w-48 lg:w-64"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <Bell 
                className="h-6 w-6 cursor-pointer hover:text-[#4FB846] transition-colors duration-200" 
              />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 hover:text-[#4FB846] transition-colors duration-200"
              >
                <User className="h-6 w-6" />
                <span>User</span>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#001845] rounded-lg shadow-lg py-1 z-50 transform opacity-100 scale-100 transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-gray-300 hover:bg-[#002466] hover:text-white transition-colors duration-200">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-gray-300 hover:bg-[#002466] hover:text-white transition-colors duration-200 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium hover:text-[#4FB846] transition-colors duration-200 ${isActive(
                    link.path
                  )}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 rounded-full bg-[#001845] text-white focus:outline-none focus:ring-2 focus:ring-[#4FB846] transition-all duration-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
