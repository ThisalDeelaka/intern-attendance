import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  UploadIcon,
  UsersIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/outline";
import { UserRoundMinus , User, UserPlus2, UserPlus2Icon } from "lucide-react";
import logo from "../assets/slt logo.jpg";

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
    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-102
    ${
      active
        ? "bg-green-600 text-white shadow-lg"
        : "text-gray-300 hover:bg-green-700/40 hover:text-white"
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className={`transform transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </div>
    {hasSubmenu && (
      <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
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
  const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="w-64 bg-gradient-to-b from-[#001845] to-[#00102F] min-h-screen h-full flex flex-col shadow-xl sticky top-0">
      {/* Logo/Header */}
      <div className="flex justify-center p-4 border-b border-gray-700/50 bg-black/20">
        <div className="relative group cursor-pointer my-4">
          <img
            src={logo}
            alt="SLT Logo"
            className="h-12 w-32 object-contain transition-all duration-300 transform group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <SidebarButton
          icon={<HomeIcon className="h-6 w-6" />}
          label="Dashboard"
          onClick={() => handleNavigation("/")}
          active={isActive("/")}
        />

        <div className="space-y-2">
          <SidebarButton
            icon={<User className="h-6 w-6" />}
            label="Intern Management"
            onClick={() => setIsInternMenuOpen(!isInternMenuOpen)}
            active={isActive("/interns")}
            hasSubmenu={true}
            isOpen={isInternMenuOpen}
          />

          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isInternMenuOpen ? 'max-h-48' : 'max-h-0'}`}>
            <div className="ml-4 pl-4 border-l border-green-600/30 space-y-2 py-2">
              <SidebarButton
                icon={<User className="h-5 w-5" />}
                label="Intern Page"
                onClick={() => handleNavigation("/interns")}
                active={isActive("/interns")}
              />
              <SidebarButton
                icon={<UserPlus2 className="h-5 w-5" />}
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
          </div>
        </div>

        <div className="space-y-2">
          <SidebarButton
            icon={<UserGroupIcon className="h-6 w-6" />}
            label="Group Management"
            onClick={() => setIsGroupMenuOpen(!isGroupMenuOpen)}
            active={isActive("/groups")}
            hasSubmenu={true}
            isOpen={isGroupMenuOpen}
          />

          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isGroupMenuOpen ? 'max-h-32' : 'max-h-0'}`}>
            <div className="ml-4 pl-4 border-l border-green-600/30 space-y-2 py-2">
              <SidebarButton
                icon={<UserPlus2Icon className="h-5 w-5" />}
                label="Create Team"
                onClick={() => handleNavigation("/groups")}
                active={isActive("/groups")}
              />
              <SidebarButton
                icon={<UserRoundMinus className="h-5 w-5" />}
                label="Manage Teams"
                onClick={() => handleNavigation("/teams")}
                active={isActive("/teams")}
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-700/50 bg-black/20">
        <button
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-green-700/40 text-gray-300 hover:text-white transition-all duration-300 group"
          onClick={() => handleNavigation("/profile")}
        >
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110">
            <span className="text-white text-sm font-medium">A</span>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">giri@gmail.com</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;