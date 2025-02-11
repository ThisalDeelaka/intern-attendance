import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/interns/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading:", error);
      setMessage("Error uploading file.");
    }
  };

  
  const handleClose = () => {
    navigate(-1); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#0D103A] to-[#4FB846]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#4FB846] hover:text-[#0D103A] text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-3xl font-semibold text-[#0D103A] text-center mb-6">Upload XLSX File</h2>

        <div className="mb-6">
          <label className="block text-lg font-medium text-[#0D103A] mb-2">Choose File:</label>
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="w-full p-3 border-2 border-[#4FB846] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4FB846]"
          />
        </div>

        <button
          onClick={handleUpload}
          className="w-full bg-[#4FB846] text-white font-semibold py-3 rounded-lg hover:bg-[#0D103A] transition duration-300"
        >
          Upload
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-lg ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadCSV;
