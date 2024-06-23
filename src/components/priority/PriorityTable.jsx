import * as React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { get } from '../../services/ApiEndpoint';
import { styled } from "@mui/material/styles";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "Name", headerName: "Name", width: 200 },
  { field: "guestPriority", headerName: "Priority", width: 200 },
  {
    field: "Arrival",
    headerName: "Arrival",
    width: 200,
  },
  {
    field: "Depart",
    headerName: "Depart",
    width: 200,
  },
];

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-root': {
    backgroundColor: '#fff',
    borderRadius: '10px',
    border: '4px solid black',
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

export default function PriorityTable({ startDate, endDate }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuestPriority = async () => {
      try {
        const params = {};
        if (startDate && endDate) {
          const adjustedEndDate = new Date(endDate);
          adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
          params.startdate = startDate.toISOString().split('T')[0];
          params.enddate = adjustedEndDate.toISOString().split('T')[0];
        }
        const response = await get("/vhp/getGuestPriority", params );
        const dataArray = Array.isArray(response.data.data)
          ? response.data.data
          : [];
        const transformedData = dataArray.map((data, index) => ({
          id: index + 1,
          Name: data.Name || "",
          Arrival: data.Arrival ? new Date(data.Arrival).toISOString().split("T")[0] : "",
          Depart: data.Depart ? new Date(data.Depart).toISOString().split("T")[0] : "",
          guestPriority: data.guestPriority,
        }));
        setRows(transformedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching guest priority data:", error);
      }
    };

    fetchGuestPriority();
  }, [startDate, endDate]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full flex flex-col border-2 border-black">
      <div style={{ height: 400, width: "100%" }}>
        {loading ? (
          <div>
            <Skeleton height={30} width={70} />
            <Skeleton height={30} width={50} />
            <Skeleton height={30} width={50} />
            {[...Array(5)].map((_, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton height={30} width={70} />
                <Skeleton height={30} width={50} />
                <Skeleton height={30} width={50} />
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
