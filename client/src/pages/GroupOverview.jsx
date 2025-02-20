import React, { useState, useEffect } from 'react';
import { api, getAuthHeaders } from "../api/apiConfig";
import { Users, Plus, Loader2, Search, X, Trash2, UserPlus } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GroupOverview = () => {
  const [teams, setTeams] = useState([]);
  const [interns, setInterns] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [fieldOfSpecialization, setFieldOfSpecialization] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch teams and interns on page load
  useEffect(() => {
    const fetchTeamsAndInterns = async () => {
      try {
        const teamResponse = await api.get("/interns/teams/all", getAuthHeaders());
        const internResponse = await api.get("/interns", getAuthHeaders());
        setTeams(teamResponse.data);
        setInterns(internResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load teams or interns.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndInterns();
  }, []);

  // Handle modal opening for adding an intern
  const handleOpenModal = (teamName) => {
    setSelectedTeam(teamName);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSearchTerm('');
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter interns based on search term and field of specialization
  const filteredInterns = interns.filter((intern) => {
    const matchesSearchTerm = intern.traineeId?.includes(searchTerm) ||
      intern.traineeName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialization = !fieldOfSpecialization || intern.fieldOfSpecialization === fieldOfSpecialization;

    return matchesSearchTerm && matchesSpecialization;
  });

  // Handle intern adding/removal from the team
  const handleAddRemoveIntern = async (internId, action) => {
    if (selectedTeam) {
      try {
        let response;
        if (action === "add") {
          response = await api.put(
            `/interns/teams/${selectedTeam}/assign-single`,
            { internId },
            getAuthHeaders()
          );
          if (response.status === 200) {
            toast.success("Intern added to the team!");
            // Update the intern list in the selected team without refreshing
            setTeams((prevTeams) =>
              prevTeams.map((team) =>
                team.name === selectedTeam
                  ? { ...team, members: [...team.members, response.data] }
                  : team
              )
            );
          } else {
            toast.error("Failed to add intern.");
          }
        } else if (action === "remove") {
          response = await api.put(
            `/interns/teams/${selectedTeam}/remove-single`,
            { internId },
            getAuthHeaders()
          );
          if (response.status === 200) {
            toast.success("Intern removed from the team!");
            // Remove the intern from the selected team without refreshing
            setTeams((prevTeams) =>
              prevTeams.map((team) =>
                team.name === selectedTeam
                  ? { ...team, members: team.members.filter((member) => member._id !== internId) }
                  : team
              )
            );
          } else {
            toast.error("Failed to remove intern.");
          }
        }
      } catch (error) {
        toast.error("Error updating intern.");
      }
    }
  };

  // Show the first 5 interns in the modal (if no search input)
  const internsToShow = searchTerm.length > 0 ? filteredInterns : interns.slice(0, 5);

  // Handle team deletion
  const handleDeleteTeam = async (teamName) => {
    try {
      const response = await api.delete(`/interns/teams/${teamName}`, getAuthHeaders());
      if (response.status === 200) {
        toast.success("Team deleted successfully.");
        // Remove deleted team from the state
        const updatedTeams = teams.filter((team) => team.name !== teamName);
        setTeams(updatedTeams);
      } else {
        toast.error("Failed to delete team.");
      }
    } catch (error) {
      toast.error("Error deleting team.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1 overflow-x-hidden">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 mt-16">
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-[#0D103A] rounded-xl">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0D103A]">Team Management</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage existing teams and their members</p>
                </div>
              </div>
            </div>

            {/* Teams Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-[#4FB846] animate-spin mb-3" />
                <p className="text-sm text-gray-500">Loading teams...</p>
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4 mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500">No teams created yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <div key={team.name} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#0D103A]">{team.name}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenModal(team.name)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-[#4FB846] hover:text-[#3f9238]"
                          >
                            <UserPlus className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTeam(team.name)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Team Members */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">Members ({team.members?.length || 0})</span>
                      </div>
                      <div className="space-y-3">
                        {team.members && team.members.length > 0 ? (
                          team.members.map((member) => (
                            <div key={member._id} className="flex items-center justify-between group">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{member.traineeName}</p>
                                <div className="text-xs text-gray-500 truncate">
                                  {member.traineeId} • {member.fieldOfSpecialization}
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddRemoveIntern(member._id, "remove")}
                                className="text-red-500 hover:text-red-600 p-1"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-3">
                            <p className="text-sm text-gray-400">No members in this team</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Intern Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-[#0D103A]">Add Members to {selectedTeam}</h3>
            </div>
            
            <div className="p-6">
              <div className="relative mb-4">
                <div className="absolute left-3 top-3.5 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search interns..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#4FB846] focus:ring-2 focus:ring-[#4FB846]/20 transition-all"
                />
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {internsToShow.length > 0 ? (
                  internsToShow.map((intern) => (
                    <div
                      key={intern._id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800">{intern.traineeName}</p>
                        <div className="text-xs text-gray-500">
                          {intern.traineeId} • {intern.fieldOfSpecialization}
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddRemoveIntern(intern._id, "add")}
                        className="ml-4 px-3 py-1.5 bg-[#4FB846] hover:bg-[#3f9238] text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Search className="h-8 w-8 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No interns found</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
        toastStyle={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}
      />
    </div>
  );
};

export default GroupOverview;
