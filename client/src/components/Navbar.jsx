import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, Menu, X, LogOut, ChevronDown } from 'lucide-react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => 
    location.pathname === path ? 'text-[#4FB846] after:w-full' : 'after:w-0';

  const navLinks = [
    { path: '/', label: 'Dashboard' },
    { path: '/interns', label: 'Intern Page' },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-[#00102F]/95 text-white fixed top-0 right-0 w-[calc(100%-256px)] py-6 ml-64 z-40 border-b border-white/5">
      <div className="max-w-full px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-[#4FB846] transition-all duration-300 hover:rotate-180"
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
                className={`text-gray-300 hover:text-[#4FB846] transition-all duration-200 py-2 relative
                          after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-0.5 
                          after:bg-[#4FB846] after:transition-all after:duration-300 hover:after:w-full
                          ${isActive(link.path)}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 text-gray-300 hover:text-[#4FB846] transition-all duration-200 group"
            >
              <div className="w-9 h-9 rounded-full bg-[#001845] flex items-center justify-center shadow-lg shadow-[#4FB846]/5 group-hover:shadow-[#4FB846]/20 transition-all duration-300">
                <User className="h-5 w-5" />
              </div>
              <span className="hidden md:block font-medium">User</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute right-0 mt-2 w-48 bg-[#001845] rounded-lg shadow-xl shadow-black/20 py-1 
                         transition-all duration-300 border border-white/5
                         ${isDropdownOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}
            >
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-[#002466] hover:text-[#4FB846] transition-all duration-200 group"
              >
                <LogOut className="h-4 w-4 mr-3 transition-transform duration-200 group-hover:translate-x-1" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden border-t border-white/5
                     ${isMobileMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="px-2 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2 text-gray-300 hover:text-[#4FB846] transition-all duration-200 rounded-lg
                          hover:bg-[#002466] ${isActive(link.path)}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;