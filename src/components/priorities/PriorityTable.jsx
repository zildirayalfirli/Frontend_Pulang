import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { styled } from "@mui/material/styles"; // Import styled from @mui/material/styles

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "guestName", headerName: "Name", width: 300 },
  { field: "guestPriority", headerName: "Priority", width: 300 },
];

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-root': {
    backgroundColor: '#fff',
    borderRadius: '10px',
    border: '4px solid black', // Set border width and color
  },
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold',
    borderRadius: '10px', 
  },
  '& .MuiDataGrid-cell': {
    color: '#333',
  },
  '& .MuiDataGrid-footerContainer': {
    backgroundColor: '#f5f5f5',
    borderRadius: '0 0 8px 8px',
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    fontWeight: 'bold',
  },
}));

export default function PriorityTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/event")
      .then((response) => {
        console.log(response.data); // Log the response data to verify structure
        const dataArray = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        const transformedData = dataArray.map((data) => ({
          id: data._id,
          guestName: data.guestId[0]?.guestName || "",
          guestPriority: data.guestPriority,
        }));
        setRows(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
