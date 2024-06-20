import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "guestName", headerName: "Name", width: 130 },
  { field: "waNumber", headerName: "WhatsApp", width: 130 },
  { field: "roomNumber", headerName: "Room", width: 130 },
  { field: "checkInDate", headerName: "Check-in Date", width: 150 },
  { field: "checkOutDate", headerName: "Check-out Date", width: 150 },
  { field: "guestPurpose", headerName: "Purpose", width: 130 },
  { field: "escorting", headerName: "Escorting", width: 130 },
  { field: "guestPriority", headerName: "Priority", width: 130 },
  { field: "voucherNumber", headerName: "Voucher Number", width: 130 },
  { field: "employeeName", headerName: "Employee", width: 130 },
];

export default function DataTable() {
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
          waNumber: data.guestId[0]?.waNumber || "",
          roomNumber: data.roomId[0]?.roomNumber || "",
          checkInDate: new Date(data.checkInDate).toLocaleDateString(),
          checkOutDate: new Date(data.checkOutDate).toLocaleDateString(),
          guestPurpose: data.guestPurpose,
          escorting: data.escorting,
          guestPriority: data.guestPriority,
          voucherNumber: data.voucherNumber,
          employeeName: data.employeeId[0]?.employeeName || "",
        }));
        setRows(transformedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
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
