import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/apiConfig";
import { toast } from "react-toastify";
import formImage from "../assets/formImage.jpg";
import logo from "../assets/logo.png";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", { name, email, password });
      if (response.data.success) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        setMessage(response.data.message || "Registration failed.");
      }
    } catch (error) {
      setMessage("Error during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-green-500">
      <div className="flex w-full max-w-4xl p-8 rounded-xl shadow-lg">
        <div className="bg-white p-8 rounded-xl w-full max-w-md xl:rounded-tr-none xl:rounded-br-none">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Register</h2>

          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter full name"
                />
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter email"
                />
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter password"
                />
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Confirm password"
                />
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full bg-green-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 text-white inline-block mr-2" />
              ) : null}
              Register
            </button>
          </form>
          {message && (
            <div className={`mt-4 p-3 rounded-lg ${message.includes("successful") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message}
            </div>
          )}
        </div>

        <div className="hidden lg:block w-full max-w-md min-h-[500px] relative">
          <img
            src={formImage}
            alt="Register"
            className="w-full h-full object-cover rounded-none lg:rounded-lg xl:rounded-tl-none xl:rounded-bl-none"
          />
        <div className="absolute bottom-4 right-4 p-2">
            <img src={logo} alt="Logo" className="w-18 h-11" />
          </div>
        </div>
      </div>

      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};

export default Register;
