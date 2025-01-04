import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { get, uploadFile, deleteUser } from "../../services/ApiEndpoint";
import Select from "react-dropdown-select";

function FileUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [allFiles, setAllFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const result = await get("/vhp/files");
      console.log("Fetched files:", result.data.data);
      setAllFiles(result.data.data);
    } catch (error) {
      console.error("Error fetching files", error);
    } finally {
      setLoading(false);
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
      setUploading(true);
      const result = await uploadFile("/vhp/upload", formData);
      console.log(result);
      if (result.data.success) {
        alert("Uploaded Successfully!!!");
        fetchFiles();
        setFile(null);
        setFileName("");
      }
    } catch (error) {
      console.error("There was an error uploading the file!", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(id);
      const result = await deleteUser(`/vhp/delete/${id}`);
      console.log(result);
      if (result.data.success) {
        alert("Deleted Successfully!!!");
        fetchFiles();
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
    {
      value: 1,
      label: "FO Report 1",
    },
    {
      value: 2,
      label: "FO Report 2",
    },
    {
      value: 3,
      label: "FO Report 3",
    },
    {
      value: 4,
      label: "Inhouse (VHP)",
    },
    {
      value: 5,
      label: "FR (VHP)",
    },
    {
      value: 6,
      label: "Outlet Bill Transaction (VHP Bar)",
    },
    {
      value: 7,
      label: "Cashier Sales (VHP Bar)",
    },
  ];

  function handleSelect(selectedFileType) {
    console.log("Selected File Type:", selectedFileType);
  }

  return (
    <div className="h-fit w-full">
      <div className="p-4 w-full flex flex-col items-center justify-center bg-primary-100 rounded-lg border-2 border-[#EE7F2B]">
        <h2 className="text-heading-2 mb-8 flex justify-center">Upload File</h2>
        <div className="bg-primary-100 p-8 w-1/2 rounded-lg shadow-lg border-2 border-black">
          <Select
            name="fileTypeSelect"
            options={options}
            onChange={handleSelect}
            searchable={true}
            color="orange"
          />
          <form
            className="flex flex-col items-center py-4"
            onSubmit={submitFile}
          >
            <label className="w-full flex flex-col border-dashed border-2 border-[#EE7F2B] items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-secondary-300 hover:text-white">
              <FaArrowUp className="h-8 w-8" />
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
              className="mt-6 bg-secondary-300 hover:bg-secondary-500 text-white py-2 px-4 h-10 w-20 rounded-lg flex justify-center items-center"
              type="submit"
              disabled={uploading}
            >
              {uploading ? <ClipLoader size={20} color="#fff" /> : "Submit"}
            </button>
          </form>
        </div>

        <div className="w-full border-2 border-black max-w-4xl mt-10 py-4 px-8 bg-primary-100 rounded-lg shadow-lg">
          <h4 className="text-xl font-bold mt-2 mb-6">Uploaded CSV Files:</h4>
          <div className="border-t border-black">
            {loading ? (
              <Skeleton count={5} height={50} className="mb-4 mt-4" />
            ) : allFiles.length === 0 ? (
              <p className="py-2">No files uploaded yet.</p>
            ) : (
              allFiles.map((data, index) => (
                <div
                  className="grid grid-cols-2 gap-4 py-2 mr-20 text-body-l"
                  key={index}
                >
                  <div className="flex items-center">{data.file.fileName}</div>
                  <div className="bg-red-500 hover:bg-red-600 w-20 ml-auto h-10 flex items-center justify-center rounded-lg">
                    <button
                      className="text-white cursor-pointer w-full h-full flex justify-center items-center"
                      onClick={() => handleDelete(data._id)}
                      disabled={deleting === data._id}
                    >
                      {deleting === data._id ? (
                        <ClipLoader size={20} color="#fff" />
                      ) : (
                        "Delete"
                      )}
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
