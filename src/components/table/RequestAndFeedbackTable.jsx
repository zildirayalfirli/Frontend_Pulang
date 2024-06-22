import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const RequestAndFeedbackTable = () => {
  const [requests, setRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchRequests();
    fetchFeedbacks();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://192.168.1.141:3000/request");
      const dataArray = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      const transformedData = dataArray.map((data) => ({
        id: data._id,
        eventId: data.eventId[0],
        item: data.item,
        quantity: data.quantity,
        employeeName: data.employeeId?.employeeName || "",
        requestTime: new Date(data.requestTime).toLocaleString(),
        executionTime: new Date(data.executionTime).toLocaleString(),
        returnDate: new Date(data.returnDate).toLocaleDateString(),
      }));
      setRequests(transformedData);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://192.168.1.141:3000/feedback");
      const dataArray = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      const transformedData = dataArray.map((data) => ({
        id: data._id,
        eventId: data.eventId[0],
        comment: data.comment,
        category: data.category,
      }));
      setFeedbacks(transformedData);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
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
