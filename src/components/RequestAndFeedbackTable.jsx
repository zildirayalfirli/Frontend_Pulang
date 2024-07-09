import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { get, post, deleteUser } from "../services/ApiEndpoint";
import ReqUpdateForm from "./input/ReqUpdateForm";
import FeedUpdateForm from "./input/FeedUpdateForm";
import logoEdit from "../assets/edit-2.svg";
import logoDelete from "../assets/trash.svg";
import logoDuplicate from "../assets/copy.svg";

const RequestAndFeedbackTable = () => {
  const [requests, setRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isRequestEdit, setIsRequestEdit] = useState(false);

  useEffect(() => {
    fetchData("/request", transformRequestData, setRequests);
    fetchData("/feedback", transformFeedbackData, setFeedbacks);
  }, []);

  const fetchData = async (endpoint, transformData, setData) => {
    try {
      const response = await get(endpoint);
      const dataArray = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      const transformedData = dataArray
        .map(transformData)
        .sort((a, b) => b.id.localeCompare(a.id));
      setData(transformedData);
    } catch (error) {
      console.error(`Error fetching data from ${endpoint}:`, error);
    }
  };

  const transformRequestData = (data) => ({
    id: data._id,
    eventId: data.eventId[0],
    item: data.item,
    quantity: data.quantity,
    employeeName: data.employeeId?.employeeName || "",
    requestTime: new Date(data.requestTime).toISOString().slice(0, 16),
    executionTime: new Date(data.executionTime).toISOString().slice(0, 16),
    returnDate: data.returnDate
      ? new Date(data.returnDate).toLocaleDateString()
      : "Not Returned",
  });

  const transformFeedbackData = (data) => ({
    id: data._id,
    eventId: data.eventId[0],
    comment: data.comment,
    category: data.category,
  });

  const handleReturnDateClick = async (id) => {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
      await post(`/request/updateReturnDate`, { id, returnDate: currentDate });
      fetchData("/request", transformRequestData, setRequests);
    } catch (error) {
      console.error(`Error updating return date for request ${id}:`, error);
    }
  };

  const handleDelete = async (id, isRequest) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const endpoint = isRequest ? `/request/${id}` : `/feedback/${id}`;
      try {
        await deleteUser(endpoint);
        fetchData(
          isRequest ? "/request" : "/feedback",
          isRequest ? transformRequestData : transformFeedbackData,
          isRequest ? setRequests : setFeedbacks
        );
      } catch (error) {
        console.error(
          `Error deleting ${isRequest ? "request" : "feedback"} ${id}:`,
          error
        );
      }
    }
  };

  const handleEdit = (row, isRequest) => {
    setEditData(row);
    setIsRequestEdit(isRequest);
  };

  const handleSave = async (updatedData) => {
    const endpoint = isRequestEdit
      ? `/request/${updatedData.id}`
      : `/feedback/${updatedData.id}`;
    try {
      await post(endpoint, updatedData);
      fetchData(
        isRequestEdit ? "/request" : "/feedback",
        isRequestEdit ? transformRequestData : transformFeedbackData,
        isRequestEdit ? setRequests : setFeedbacks
      );
      setEditData(null);
    } catch (error) {
      console.error(
        `Error updating ${isRequestEdit ? "request" : "feedback"} ${
          updatedData.id
        }:`,
        error
      );
    }
  };

  const handleDuplicate = async (row, isRequest) => {
    const endpoint = isRequest ? "/request" : "/feedback";
    const newData = { ...row, id: undefined }; // Remove the id to create a new entry
    try {
      await post(endpoint, newData);
      fetchData(
        isRequest ? "/request" : "/feedback",
        isRequest ? transformRequestData : transformFeedbackData,
        isRequest ? setRequests : setFeedbacks
      );
    } catch (error) {
      console.error(
        `Error duplicating ${isRequest ? "request" : "feedback"} ${row.id}:`,
        error
      );
    }
  };

  const requestColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "eventId", headerName: "Event ID", width: 150 },
    { field: "item", headerName: "Item", width: 150 },
    { field: "quantity", headerName: "Quantity", width: 100 },
    { field: "employeeName", headerName: "Employee Name", width: 150 },
    { field: "requestTime", headerName: "Request Time", width: 200 },
    { field: "executionTime", headerName: "Execution Time", width: 200 },
    { field: "returnDate", headerName: "Return Date", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div>
          <button onClick={() => handleEdit(params.row, true)}>
            <img src={logoEdit} alt="edit" className="scale-150 px-4" />
          </button>
          <button onClick={() => handleDelete(params.row.id, true)}>
            <img src={logoDelete} alt="delete" className="scale-150 px-4" />
          </button>
          <button
            onClick={() => handleReturnDateClick(params.row.id)}
            className="bg-secondary-300 hover:bg-secondary-500 text-white font-bold px-2 rounded"
          >
            Set Return Date
          </button>
          <button onClick={() => handleDuplicate(params.row, true)}>
            <img
              src={logoDuplicate}
              alt="duplicate"
              className="scale-150 px-4"
            />
          </button>
        </div>
      ),
    },
  ];

  const feedbackColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "eventId", headerName: "Event ID", width: 150 },
    { field: "comment", headerName: "Comment", width: 300 },
    { field: "category", headerName: "Category", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div>
          <button onClick={() => handleEdit(params.row, false)}>
            <img src={logoEdit} alt="edit" className="scale-150 px-4" />
          </button>
          <button onClick={() => handleDelete(params.row.id, false)}>
            <img src={logoDelete} alt="delete" className="scale-150 px-4" />
          </button>
          <button onClick={() => handleDuplicate(params.row, false)}>
            <img
              src={logoDuplicate}
              alt="duplicate"
              className="scale-150 px-4"
            />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Requests</h2>
      <div className="flex justify-center my-4">
        {editData && isRequestEdit && (
          <ReqUpdateForm
            data={editData}
            onSave={handleSave}
            onCancel={() => setEditData(null)}
          />
        )}
      </div>
      <div
        className="overflow-x-auto mb-8"
        style={{ height: 400, width: "100%" }}
      >
        <DataGrid
          rows={requests}
          columns={requestColumns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          checkboxSelection
        />
      </div>
      <h2 className="text-2xl font-semibold mb-4">Feedbacks</h2>
      <div className="flex justify-center my-4">
        {editData && !isRequestEdit && (
          <FeedUpdateForm
            data={editData}
            onSave={handleSave}
            onCancel={() => setEditData(null)}
          />
        )}
      </div>
      <div className="overflow-x-auto" style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={feedbacks}
          columns={feedbackColumns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          checkboxSelection
        />
      </div>
    </div>
  );
};

export default RequestAndFeedbackTable;
