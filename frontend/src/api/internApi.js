import axios from "axios";

const API_URL = "http://localhost:5000/api/interns";

export const fetchInterns = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const fetchAttendanceStats = async () => {
  const response = await axios.get(`${API_URL}/attendance-stats`);
  return response.data;
};
