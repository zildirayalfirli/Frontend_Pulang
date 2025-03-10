import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Select from "react-dropdown-select";
import { get, uploadFile, deleteUser } from "../../services/ApiEndpoint";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [allFiles, setAllFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const optionToEndpointMap = {
    1: "/api/files/Fr",
    2: "/api/files/Ih",
    3: "/api/files/Obt",
    4: "/api/files/Escort",
    5: "/api/files/Comment",
    6: "/api/files/Request",
    7: "/api/files/Banquet",
    8: "/api/files/Restaurant",
    9: "/api/files/Roomservice",
  };

  const uploadEndpointMap = {
    1: "/api/files/uploadFr",
    2: "/api/files/uploadIh",
    3: "/api/files/uploadObt",
    4: "/api/files/uploadEscort",
    5: "/api/files/uploadComment",
    6: "/api/files/uploadRequest",
    7: "/api/files/uploadBanquet",
    8: "/api/files/uploadRestaurant",
    9: "/api/files/uploadRoomservice",
  };

  const deleteEndpointMap = {
    1: "/api/files/deleteFr",
    2: "/api/files/deleteIh",
    3: "/api/files/deleteObt",
    4: "/api/files/deleteEscort",
    5: "/api/files/deleteComment",
    6: "/api/files/deleteRequest",
    7: "/api/files/deleteBanquet",
    8: "/api/files/deleteRestaurant",
    9: "/api/files/deleteRoomservice",
  };

  const fetchAllFiles = async () => {
    try {
      setLoading(true);
      const fileData = {};
      for (const [key, endpoint] of Object.entries(optionToEndpointMap)) {
        try {
          const result = await get(endpoint);
          fileData[key] = result.data.data || [];
        } catch (error) {
          console.error(`Error fetching files for option ${key}`, error);
          fileData[key] = [];
        }
      }
      setAllFiles(fileData);
    } catch (error) {
      console.error("Error fetching files", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilesByType = async (optionValue) => {
    if (!optionValue) return;
    try {
      setLoading(true);
      const endpoint = optionToEndpointMap[optionValue];
      if (!endpoint) {
        console.error(`No endpoint found for option ${optionValue}`);
        return;
      }
      const result = await get(endpoint);
      setAllFiles({ [optionValue]: result.data.data || [] });
    } catch (error) {
      console.error(`Error fetching files for option ${optionValue}:`, error);
      setAllFiles({ [optionValue]: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOption) {
      fetchFilesByType(selectedOption.value);
    } else {
      fetchAllFiles();
    }
  }, [selectedOption]);

  const submitFile = async (e) => {
    e.preventDefault();
    if (!selectedOption || !file) {
      alert("Please select a file type and a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const endpoint = uploadEndpointMap[selectedOption.value];
    if (!endpoint) {
      alert("Invalid file type selected.");
      return;
    }

    try {
      setUploading(true);
      const result = await uploadFile(endpoint, formData);
      if (result.data.success) {
        alert("Uploaded Successfully!!!");
        fetchFilesByType(selectedOption.value);
        setFile(null);
        setFileName("");
      }
    } catch (error) {
      console.error("There was an error uploading the file!", error);

      if (error.response && error.response.data.msg === "Please Input the correct file type") {
        alert("Please Input the correct file type");
      } else {
        alert("Please Input the correct file type");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, optionValue) => {
    const endpoint = deleteEndpointMap[optionValue];
    if (!endpoint) {
      alert("Invalid file type selected for deletion.");
      return;
    }

    try {
      setDeleting(id);
      const result = await deleteUser(`${endpoint}/${id}`);
      if (result.data.success) {
        alert("Deleted Successfully!!!");
        if (selectedOption) {
          fetchFilesByType(selectedOption.value);
        } else {
          fetchAllFiles();
        }
      } else {
        alert("Error: " + result.data.msg);
      }
    } catch (error) {
      console.error("There was an error deleting the file!", error);
    } finally {
      setDeleting(null);
    }
  };

  const options = [
    { value: 1, label: "FR (VHP)" },
    { value: 2, label: "Inhouse (VHP)" },
    { value: 3, label: "Outlet Bill Transaction (VHP Bar)" },
    { value: 4, label: "FO Escort" },
    { value: 5, label: "FO Comment" },
    { value: 6, label: "FO Request" },
    { value: 7, label: "Cashier Sales (Banquet)" },
    { value: 8, label: "Cashier Sales (Restaurant)" },
    { value: 9, label: "Cashier Sales (Room Service)" },
  ];

  return (
    <div className="h-fit w-full">
      <div className="p-4 w-full flex flex-col items-center justify-center bg-primary-100 rounded-lg border-2 border-[#EE7F2B]">
        <h2 className="text-heading-2 mb-8 flex justify-center">Uploaded Files</h2>
        <div className="bg-primary-100 p-8 w-1/2 rounded-lg shadow-lg border-2 border-black">
          <Select
            name="fileTypeSelect"
            options={options}
            onChange={(selected) => setSelectedOption(selected[0])}
            value={selectedOption ? [selectedOption] : []}
            placeholder="Select a file type"
            searchable
            color="orange"
          />
          <form className="flex flex-col items-center py-4" onSubmit={submitFile}>
            <label className="w-full flex flex-col border-dashed border-2 border-[#EE7F2B] items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border cursor-pointer hover:bg-secondary-300 hover:text-white">
              <FaArrowUp className="h-8 w-8" />
              <span className="mt-2 text-base leading-normal">Upload File</span>
              <input
                type="file"
                className="hidden"
                accept=".csv"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setFileName(e.target.files[0]?.name || "");
                  e.target.value = null; // Reset input value to allow re-selection
                }}
              />
            </label>

            {fileName && <div className="mt-2 text-gray-600">Selected file: {fileName}</div>}
            <button
              className="mt-6 bg-secondary-300 hover:bg-secondary-500 text-white py-2 px-4 h-10 w-20 rounded-lg flex justify-center items-center"
              type="submit"
              disabled={uploading}
            >
              {uploading ? <ClipLoader size={20} color="#fff" /> : "Submit"}
            </button>
          </form>
        </div>
        {loading ? (
          <Skeleton className="mb-4 mt-10 border border-black h-56 w-96" />
        ) : (
          Object.entries(allFiles).map(([key, files]) => (
            <div key={key} className="w-full border-2 border-black max-w-4xl mt-10 py-4 px-8 bg-primary-100 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold mt-2 mb-6">{options.find((o) => o.value === Number(key))?.label || "Unknown"}:</h4>
              <div className="grid grid-cols-3 text-lg font-semibold border-b-2 pb-2">
                <div className="flex justify-center">File Name</div>
                <div className="flex justify-center">Created At</div>
                <div className="flex justify-center">Actions</div>
              </div>
              {files.length > 0 ? (
                files.map((file, index) => (
                  <div key={index} className="grid grid-cols-3 items-center text-sm py-2 border-b">
                    <div className="flex justify-center">{file.fileName || "No file name available"}</div>
                    <div className="flex justify-center">{new Date(file.createdAt).toLocaleString()}</div>
                    <div className="flex justify-center">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        onClick={() => handleDelete(file._id, key)}
                        disabled={deleting === file._id}
                      >
                        {deleting === file._id ? <ClipLoader size={20} color="#fff" /> : "Delete"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-2 text-center">No files uploaded yet.</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FileUpload;
