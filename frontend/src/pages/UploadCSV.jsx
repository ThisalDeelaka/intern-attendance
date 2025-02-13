import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { X, Upload, FileUp } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const UploadCSV = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    if (file?.name === selectedFile.name) return; // Prevent duplicate selections

    if (selectedFile.name.endsWith('.xlsx')) {
      setFile(selectedFile);
      setMessage("");
    } else {
      setMessage("Please select an XLSX file.");
      setFile(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
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
    <div className="min-h-screen bg-white flex">
      {/* Navbar */}
      <Sidebar />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Navbar />
        

        {/* Main Content */}
        <div className="flex-1 mr-24 pt-16 flex items-center justify-center">
          <div className="bg-[#001845] p-8 rounded-xl shadow-lg w-full max-w-md relative border border-gray-700 m-4">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#4FB846] transition-colors duration-200"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-semibold text-white text-center mb-8">
              Upload XLSX File
            </h2>

            {/* Drag and Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? 'border-[#4FB846] bg-[#001845]'
                  : 'border-gray-600 hover:border-[#4FB846]'
              }`}
            >
              <FileUp className="w-12 h-12 mx-auto mb-4 text-gray-400 pointer-events-none" />
              <p className="text-gray-300 mb-2 pointer-events-none">
                Drag and drop your XLSX file here, or click to browse
              </p>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-block px-4 py-2 bg-[#001845] text-[#4FB846] rounded-lg cursor-pointer hover:text-white transition-colors duration-200"
              >
                Select File
              </label>
              {file && (
                <p className="mt-4 text-sm text-gray-400">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              className="w-full bg-[#4FB846] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#3da635] transition-colors duration-200 flex items-center justify-center space-x-2 mt-4"
            >
              <Upload size={20} />
              <span>Upload File</span>
            </button>

            {/* Message Display */}
            {message && (
              <div className={`mt-4 p-4 rounded-lg ${
                message.includes("Error")
                  ? 'bg-red-900/20 text-red-400'
                  : 'bg-green-900/20 text-green-400'
              }`}>
                <p className="text-center text-sm">{message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCSV;
