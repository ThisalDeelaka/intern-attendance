import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  UploadIcon,
  CogIcon,
  SupportIcon,
  UsersIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import logo from "../assets/slt logo.jpg";
import { User } from "lucide-react";

const SidebarButton = ({
  icon,
  label,
  onClick,
  active,
  hasSubmenu,
  isOpen,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 
    ${
      active
        ? "bg-[#2e9a24] text-white"
        : "text-gray-400 hover:bg-[#2d7827] hover:text-white"
    }`}
  >
    <div className="flex items-center space-x-3">
      {icon}
      <span className="font-medium">{label}</span>
    </div>
    {hasSubmenu && (
      <div className="text-gray-400">
        {isOpen ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </div>
    )}
  </button>
);

const Sidebar = () => {
  const [isInternMenuOpen, setIsInternMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="w-64 bg-[#00102F] min-h-screen h-full flex flex-col shadow-xl sticky top-0">
      {/* Logo/Header */}
      <div className="flex justify-center p-4 border-b border-gray-700">
        <img
          src={logo}
          alt="SLT Logo"
          className="h-auto w-12 object-contain md:h-auto md:w-32 my-5"
        />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <SidebarButton
          icon={<HomeIcon className="h-6 w-6" />}
          label="Dashboard"
          onClick={() => handleNavigation("/")}
          active={isActive("/")}
        />

        <div className="space-y-1">
          <SidebarButton
            icon={<UserGroupIcon className="h-6 w-6" />}
            label="Intern Management"
            onClick={() => setIsInternMenuOpen(!isInternMenuOpen)}
            active={isActive("/interns")}
            hasSubmenu={true}
            isOpen={isInternMenuOpen}
          />

          {isInternMenuOpen && (
            <div className="ml-4 pl-4 border-l border-gray-700 space-y-1">
              <SidebarButton
                icon={<User className="h-5 w-5" />}
                label="Intern Page"
                onClick={() => handleNavigation("/interns")}
                active={isActive("/interns")}
              />
              <SidebarButton
                icon={<User className="h-5 w-5" />}
                label="Add Interns"
                onClick={() => handleNavigation("/add-intern")}
                active={isActive("/add-intern")}
              />
              <SidebarButton
                icon={<UploadIcon className="h-5 w-5" />}
                label="Upload CSV"
                onClick={() => handleNavigation("/upload")}
                active={isActive("/upload")}
              />
            </div>
          )}
        </div>

        <SidebarButton
          icon={<UsersIcon className="h-6 w-6" />}
          label="Create Team"
          onClick={() => handleNavigation("/groups")}
          active={isActive("/groups")}
        />

        <SidebarButton
          icon={<CogIcon className="h-6 w-6" />}
          label="Settings"
          onClick={() => handleNavigation("/settings")}
          active={isActive("/settings")}
        />

        <SidebarButton
          icon={<SupportIcon className="h-6 w-6" />}
          label="Help/Support"
          onClick={() => handleNavigation("/help")}
          active={isActive("/help")}
        />
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-700">
        <button
          className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-[#3b8b34] text-gray-400 hover:text-white transition-all duration-200"
          onClick={() => handleNavigation("/profile")}
        >
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-white text-sm">A</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">admin@SLT.com</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;