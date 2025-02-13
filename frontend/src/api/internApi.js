import axios from "axios";

const API_URL = "http://localhost:5000/api/interns";

// Fetch all interns
export const fetchInterns = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch interns");
  }
};

// Fetch attendance statistics
export const fetchAttendanceStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/attendance-stats`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch attendance stats");
  }
};

// Fetch a single intern by ID
export const fetchInternById = async (internId) => {
  try {
    const response = await axios.get(`${API_URL}/${internId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch intern");
  }
};

// Mark attendance for an intern
export const markAttendance = async (internId, status) => {
  try {
    const response = await axios.post(`${API_URL}/mark-attendance/${internId}`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to mark attendance");
  }
};

// Upload interns from Excel file
export const uploadInternsFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to upload file");
  }
};

// Delete an intern
export const deleteIntern = async (internId) => {
  try {
    const response = await axios.delete(`${API_URL}/${internId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete intern");
  }
};

// Update intern details
export const updateIntern = async (internId, internData) => {
  try {
    const response = await axios.put(`${API_URL}/${internId}`, internData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update intern");
  }
};

// Fetch attendance history for an intern
export const fetchAttendanceHistory = async (internId) => {
  try {
    const response = await axios.get(`${API_URL}/${internId}/attendance`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch attendance history");
  }
};

// Add bulk attendance
export const markBulkAttendance = async (attendanceData) => {
  try {
    const response = await axios.post(`${API_URL}/bulk-attendance`, attendanceData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to mark bulk attendance");
  }
};

