import React, { useState, useEffect, useCallback } from 'react';
import { api, getAuthHeaders } from "../api/apiConfig";
import { Users, Plus, Loader2, Search, X, Trash2, UserPlus, ChevronDown } from 'lucide-react';
import {
  UserGroupIcon,
} from "@heroicons/react/outline";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

// TeamCard Component
const TeamCard = ({ team, onAddMember, onRemoveMember, onDeleteTeam }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-blue-500 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#001845]/10 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-[#001845]" />
            </div>
            <h3 className="text-lg font-semibold text-[#060B27]">{team.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddMember(team.name)}
              className="inline-flex items-center justify-center p-2 hover:bg-[#060B27]/5 rounded-xl text-[#060B27] transition-colors"
            >
              <UserPlus className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDeleteTeam(team.name)}
              className="inline-flex items-center justify-center p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              Members ({team.members?.length || 0})
            </span>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-500 hover:text-[#060B27] transition-colors"
            >
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className={`space-y-3 transition-all duration-300 ${isExpanded ? 'max-h-[500px]' : 'max-h-48'} overflow-hidden`}>
            {team.members?.map((member) => (
              <div key={member._id} className="group p-4 rounded-xl bg-gray-50 hover:bg-[#060B27]/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#060B27]">{member.traineeName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{member.traineeId}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-sm text-gray-500">{member.fieldOfSpecialization}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveMember(team.name, member._id)}
                    className="opacity-100  p-2 bg-red-200 text-sm text-red-700 hover:bg-red-400 rounded-full transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// AddMemberModal Component
const AddMemberModal = ({ isOpen, onClose, teamName, availableInterns, onAddIntern }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInterns = availableInterns.filter(intern =>
    intern.traineeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    intern.traineeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return isOpen ? (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white border rounded-2xl w-full max-w-lg mx-4 shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#060B27]">Add Members to {teamName}</h3>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#060B27] focus:ring focus:ring-[#060B27]/20 transition-all"
            />
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredInterns.map(intern => (
              <div key={intern._id} className="p-4 rounded-xl bg-gray-50 hover:bg-[#060B27]/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#060B27]">{intern.traineeName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{intern.traineeId}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-sm text-gray-500">{intern.fieldOfSpecialization}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddIntern(intern._id)}
                    className="p-3 rounded-full bg-green-100 hover:bg-green-300 text-green-700 font-medium transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

// Main Component
const GroupOverview = () => {
  const [teams, setTeams] = useState([]);
  const [interns, setInterns] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [teamResponse, internResponse] = await Promise.all([
        api.get("/interns/teams/all", getAuthHeaders()),
        api.get("/interns", getAuthHeaders())
      ]);
      setTeams(teamResponse.data);
      setInterns(internResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load teams or interns.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddMember = (teamName) => {
    setSelectedTeam(teamName);
    setModalOpen(true);
  };

  const handleAddIntern = async (internId) => {
    try {
      const response = await api.put(
        `/interns/teams/${selectedTeam}/assign-single`,
        { internId },
        getAuthHeaders()
      );
      if (response.status === 200) {
        toast.success("Intern added to the team!");
        fetchData(); // Refresh data
      }
    } catch (error) {
      toast.error("Error adding intern.");
    } finally {
      setModalOpen(false);
    }
  };

  const handleRemoveMember = async (teamName, internId) => {
    try {
      const response = await api.put(
        `/interns/teams/${teamName}/remove`,
        { internId },
        getAuthHeaders()
      );
      if (response.status === 200) {
        toast.success("Intern removed from the team.");
        fetchData(); // Refresh data
      }
    } catch (error) {
      toast.error("Error removing intern.");
    }
  };

  const handleDeleteTeam = async (teamName) => {
    try {
      const response = await api.delete(`/interns/teams/${teamName}`, getAuthHeaders());
      if (response.status === 200) {
        toast.success("Team deleted successfully.");
        fetchData(); // Refresh data
      }
    } catch (error) {
      toast.error("Error deleting team.");
    }
  };

  const getAvailableInterns = (teamName) => {
    const team = teams.find(t => t.name === teamName);
    if (!team) return interns;
    return interns.filter(intern => !team.members.some(member => member._id === intern._id));
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mt-28">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 rounded-2xl">
                <UserGroupIcon className="h-10 w-auto text-4xl  text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#060B27]">Team Management</h1>
                <p className="text-gray-500">Organize and manage your teams effectively</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {teams.map((team) => (
                <TeamCard
                  key={team.name}
                  team={team}
                  onAddMember={handleAddMember}
                  onRemoveMember={handleRemoveMember}
                  onDeleteTeam={handleDeleteTeam}
                />
              ))}
            </div>
          )}
        </main>

        <AddMemberModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          teamName={selectedTeam}
          availableInterns={getAvailableInterns(selectedTeam)}
          onAddIntern={handleAddIntern}
        />

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default GroupOverview;