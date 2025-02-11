import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        setMessage("Login successful!");
        navigate("/dashboard"); 
      } else {
        setMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Error logging in. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#0D103A] to-[#4FB846]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold text-[#0D103A] text-center mb-6">Login</h2>

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-[#0D103A] mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border-2 border-[#4FB846] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FB846]"
            />
          </div>

          {/* Password Input */}
          <div className="mb-6 relative">
            <label className="block text-lg font-medium text-[#0D103A] mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border-2 border-[#4FB846] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FB846] pr-10"
            />
            {/* Eye Icon for Password Visibility */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-10 right-3 text-gray-500 hover:text-[#4FB846]"
            >
              {showPassword ? <EyeOffIcon className="h-6 w-6" /> : <EyeIcon className="h-6 w-6" />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#4FB846] text-white font-semibold py-3 rounded-lg hover:bg-[#0D103A] transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Display message */}
        {message && (
          <p
            className={`mt-4 text-center text-lg ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Forgot Password & Signup Links */}
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Forgot your password?{" "}
            <a href="/reset-password" className="text-[#4FB846] hover:underline">
              Reset here
            </a>
          </p>
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-[#4FB846] hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
