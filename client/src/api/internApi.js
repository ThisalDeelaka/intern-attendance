import axios from "axios";

const API_URL = "http://localhost:5000/api/interns";


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("⚠ No token found in localStorage");
    return { headers: {} };
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    console.error("Unauthorized Access! Redirecting to login...");
    localStorage.removeItem("token"); 
    window.location.href = "/login"; 
    return null; 
  }
  console.error("API Error:", error.response?.data?.message || error.message);
  return null;
};


export const fetchInterns = async () => {
  try {
    console.log("🔍 Fetching interns... (Token found:", !!localStorage.getItem("token"), ")");
    const response = await axios.get(API_URL, getAuthHeaders());
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};


export const fetchAttendanceStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/attendance-stats`, getAuthHeaders());
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};


export const fetchInternById = async (internId) => {
  try {
    const response = await axios.get(`${API_URL}/${internId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};


export const markAttendance = async (internId, status) => {
  try {
    const response = await axios.post(
      `${API_URL}/attendance/mark/${internId}`,
      { status },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};


export const uploadInternsFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("http://localhost:5000/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};


export const deleteIntern = async (internId) => {
  try {
    const response = await axios.delete(`${API_URL}/${internId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};


export const updateIntern = async (internId, internData) => {
  try {
    const response = await axios.put(`${API_URL}/${internId}`, internData, getAuthHeaders());
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};


export const fetchAttendanceHistory = async (internId) => {
  try {
    const response = await axios.get(`${API_URL}/attendance-history/${internId}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};


export const markBulkAttendance = async (attendanceData) => {
  try {
    const response = await axios.post(`${API_URL}/attendance/bulk-mark`, attendanceData, getAuthHeaders());
    return response.data;
  } catch (error) {
    return handleAuthError(error);
  }
};
