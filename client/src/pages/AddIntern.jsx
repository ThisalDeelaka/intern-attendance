import { useState, useEffect } from 'react';
import { api, getAuthHeaders } from "../api/apiConfig";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, User, Briefcase, PlusCircle, Loader2 } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Toaster, toast } from "react-hot-toast";

const AddIntern = () => {
  const [traineeId, setTraineeId] = useState("");
  const [traineeName, setTraineeName] = useState("");
  const [fieldOfSpecialization, setFieldOfSpecialization] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await api.get("/interns", getAuthHeaders());
        const fetchedInterns = response.data || [];
        const uniqueSpecializations = Array.from(
          new Set(fetchedInterns.map((intern) => intern.fieldOfSpecialization).filter(Boolean))
        ).sort();
        setSpecializations(uniqueSpecializations);
      } catch (error) {
        console.error("Error fetching specializations:", error);
        toast.error("Failed to load specializations.");
      }
    };

    fetchInterns();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!traineeId || !traineeName || !fieldOfSpecialization) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
        "/interns/add",
        { traineeId, traineeName, fieldOfSpecialization },
        getAuthHeaders()
      );

      if (response.status === 201) {
        toast.success("🎉 Intern added successfully!");
        setTraineeId("");
        setTraineeName("");
        setFieldOfSpecialization("");
      }
    } catch (error) {
      console.error("Error adding intern:", error);
      toast.error("Error adding intern.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-[#F9F9F9]">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex flex-1 justify-center items-center px-6 sm:px-10">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg border border-[#4FB846]">
            <h1 className="text-2xl font-bold text-[#0D103A] mb-6 text-center">Add Intern</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Trainee ID */}
              <div>
                <label className="block text-sm font-semibold text-[#0D103A] mb-1 flex items-center gap-2">
                  <BadgeCheck size={18} className="text-[#4FB846]" /> Trainee ID <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={traineeId}
                    onChange={(e) => setTraineeId(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FB846] focus:border-[#4FB846] transition-all bg-gray-50"
                    required
                    placeholder="Enter trainee ID"
                  />
                  <BadgeCheck className="absolute left-3 top-3 text-gray-400" size={20} />
                </div>
              </div>

              {/* Trainee Name */}
              <div>
                <label className="block text-sm font-semibold text-[#0D103A] mb-1 flex items-center gap-2">
                  <User size={18} className="text-[#4FB846]" /> Trainee Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={traineeName}
                    onChange={(e) => setTraineeName(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FB846] focus:border-[#4FB846] transition-all bg-gray-50"
                    required
                    placeholder="Enter trainee name"
                  />
                  <User className="absolute left-3 top-3 text-gray-400" size={20} />
                </div>
              </div>

              {/* Field of Specialization (Dropdown) */}
              <div>
                <label className="block text-sm font-semibold text-[#0D103A] mb-1 flex items-center gap-2">
                  <Briefcase size={18} className="text-[#4FB846]" /> Field of Specialization <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={fieldOfSpecialization}
                    onChange={(e) => setFieldOfSpecialization(e.target.value)}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#4FB846] focus:border-[#4FB846] appearance-none"
                    required
                  >
                    <option value="" disabled>Select specialization</option>
                    {specializations.map((spec, index) => (
                      <option key={index} value={spec}>{spec}</option>
                    ))}
                  </select>
                  <Briefcase className="absolute left-3 top-3 text-gray-400" size={20} />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full bg-[#4FB846] hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <PlusCircle size={20} /> Add Intern
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
    </div>
  );
};

export default AddIntern;
