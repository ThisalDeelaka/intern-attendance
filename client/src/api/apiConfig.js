import axios from "axios";

// Utility function to check token expiration
const isTokenExpired = (token) => {
  if (!token) return true;
  const { exp } = JSON.parse(atob(token.split('.')[1])); // Decode token to get expiry time
  return exp * 1000 < Date.now(); // Expiry time in milliseconds
};

export const api = axios.create({
  baseURL: "http://localhost:5000/api", 
});

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    console.warn("⚠ Token expired or missing. Redirecting to login.");
    localStorage.removeItem("token"); 
    window.location.href = "/login"; 
    return {};
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
