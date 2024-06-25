import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { get, post } from "../services/ApiEndpoint";

const RequestAndFeedbackTable = () => {
  const [requests, setRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

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
    requestTime: new Date(data.requestTime).toLocaleString(),
    executionTime: new Date(data.executionTime).toLocaleString(),
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
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => handleReturnDateClick(params.row.id)}
          className="bg-secondary-300 hover:bg-secondary-500 text-white font-bold px-2 rounded"
        >
          Set Return Date
        </button>
      ),
    },
  ];

  const feedbackColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "eventId", headerName: "Event ID", width: 150 },
    { field: "comment", headerName: "Comment", width: 300 },
    { field: "category", headerName: "Category", width: 150 },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Requests</h2>
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
