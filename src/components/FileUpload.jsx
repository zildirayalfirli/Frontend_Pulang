import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowUp } from "react-icons/fa";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [allFiles, setAllFiles] = useState([]);

  const fetchFiles = async () => {
    try {
      const result = await axios.get("http://localhost:3000/vhp/files");
      console.log("Fetched files:", result.data.data); 
      setAllFiles(result.data.data); 
    } catch (error) {
      console.error("Error fetching files", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const submitFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    console.log(file);

    try {
      const result = await axios.post(
        "http://localhost:3000/vhp/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log(result);
      if (result.data.success) {
        alert("Uploaded Successfully!!!");
        fetchFiles();
        setFile(null);
        setFileName("");
      }
    } catch (error) {
      console.error("There was an error uploading the file!", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await axios.delete(`http://localhost:3000/vhp/delete/${id}`);
      console.log(result);
      if (result.data.success) {
        alert("Deleted Successfully!!!");
        fetchFiles();
      } else {
        alert("Error: " + result.data.msg);
      }
    } catch (error) {
      console.error("There was an error deleting the file!", error);
    }
  };

  return (
    <div className="h-fit w-full">
    <div className="py-8 flex flex-col items-center justify-center bg-primary-100 rounded-lg border-2 border-[#EE7F2B]">
      <div className="bg-white p-8 w-1/2 rounded-lg shadow-lg border-2 border-black">
        <form className="flex flex-col items-center" onSubmit={submitFile}>
          <label className="w-64 flex flex-col border-dashed border-2 border-[#EE7F2B] items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-secondary-300 hover:text-white">
          <FaArrowUp className="h-8 w-8"/>
            <span className="mt-2 text-base leading-normal">Upload File</span>
            <input 
              type="file" 
              className="hidden" 
              accept=".csv" 
              required 
              onChange={(e) => {
                setFile(e.target.files[0]);
                setFileName(e.target.files[0]?.name || "");
              }} 
            />
          </label>
          {fileName && (
            <div className="mt-2 text-gray-600">
              Selected file: {fileName}
            </div>
          )}
          <button 
            className="mt-6 bg-secondary-300 hover:bg-secondary-500 text-white py-2 px-4 h-10 w-20 rounded-lg flex justify-center items-center" type="submit">
            Submit
          </button>
        </form>
      </div>
      
      <div className="w-1/2 border-2 border-black max-w-4xl mt-8 p-4 bg-white rounded-lg shadow-lg">
        <h4 className="text-xl font-bold mb-4">Uploaded CSV Files:</h4>
        <div className="border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="font-semibold">Title</div>
          </div>
          {allFiles.length === 0 ? (
            <p className="py-2">No files uploaded yet.</p>
          ) : (
            allFiles.map((data, index) => (
              <div className="grid grid-cols-2 gap-4 py-2 mr-20" key={index}>
                <div className="flex items-center">{data.file.fileName}</div>
                <div className="bg-red-500 hover:bg-red-600 w-20 ml-auto h-10 flex items-center justify-center rounded-lg">
                <button 
                  className="text-white cursor-pointer w-full h-full flex justify-center items-center" 
                  onClick={() => handleDelete(data._id)}
                >
                  Delete
                </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export default FileUpload;
