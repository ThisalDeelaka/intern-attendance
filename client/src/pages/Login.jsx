import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/apiConfig"; 
import { toast } from "react-toastify";
import { User, Lock, Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/"); 
      } else {
        setMessage("Invalid email or password.");
      }
    } catch (error) {
      setMessage("Error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-green-500">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
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
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
            </div>
          </div>

          <div className="mb-6">
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

          <button
            type="submit"
            className={`w-full bg-green-500 text-white font-semibold py-3 rounded-lg transition-all duration-300 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 text-white inline-block mr-2" />
            ) : null}
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-500">{message}</p>}

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/register")}
          >
            Register here
          </span>
        </p>
      </div>

      <Toaster position="bottom-right" reverseOrder={false} />
    </div>
  );
};

export default Login;
