import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { get, post, deleteUser } from "../services/ApiEndpoint";
import axios from "axios";
import logoUpdate from "../assets/edit-2.svg";
import logoDelete from "../assets/trash.svg";
import UpdateForm from "./input/UpdateForm";
import RequestAndFeedbackForm from "./input/RequestAndFeedbackForm";

const DataTable = () => {
  const [rows, setRows] = useState([]);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [editData, setEditData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await get("/event");
      const dataArray = Array.isArray(response.data.data)
        ? response.data.data
        : [];
      const transformedData = dataArray
        .map((data) => ({
          id: data._id,
          guestName: data.guestId[0]?.guestName || "",
          waNumber: data.guestId[0]?.waNumber || "",
          roomNumber: data.roomId[0]?.roomNumber || "",
          checkInDate: new Date(data.checkInDate).toISOString().split("T")[0],
          checkOutDate: new Date(data.checkOutDate).toISOString().split("T")[0],
          guestPurpose: data.guestPurpose,
          escorting: data.escorting,
          guestPriority: data.guestPriority,
          voucherNumber: data.voucherNumber,
          plateNumber: data.plateNumber,
          employeeName: data.employeeId[0]?.employeeName || "",
        }))
        .sort((a, b) => b.id.localeCompare(a.id));
      setRows(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deleteUser(`/event/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("Error deleting data");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (
      window.confirm("Are you sure you want to delete the selected records?")
    ) {
      try {
        const deletePromises = rowSelectionModel.map((id) =>
          deleteUser(`/event/${id}`)
        );
        await Promise.all(deletePromises);
        setRowSelectionModel([]);
        fetchData();
      } catch (error) {
        console.error("Error deleting data:", error);
        alert("Error deleting data");
      }
    }
  };

  const handleUpdate = (row) => {
    setEditData(row);
  };

  const handleSave = async (updatedData) => {
    try {
      const guestResponse = await post("/guest", {
        guestName: updatedData.guestName,
        waNumber: updatedData.waNumber,
      });

      const guestId = guestResponse.data.data._id;

      const roomResponse = await get(
        `/room/bynumber?roomNumber=${updatedData.roomNumber}`
      );
      const roomId = roomResponse.data.data._id;

      const employeeResponse = await get(
        `/employee/byname?employeeName=${updatedData.employeeName}`
      );
      const employeeId = employeeResponse.data.data._id;

      if (!guestId || !roomId || !employeeId) {
        alert("Failed to fetch IDs. Please check the responses.");
        return;
      }

      const dataToSend = {
        guestId: guestId.toString(),
        roomId: roomId.toString(),
        guestPurpose: updatedData.guestPurpose.toString(),
        escorting: updatedData.escorting.toString(),
        voucherNumber: updatedData.voucherNumber.toString(),
        guestPriority: JSON.stringify(updatedData.guestPriority),
        plateNumber: updatedData.plateNumber.toString(),
        employeeId: employeeId.toString(),
        checkInDate: updatedData.checkInDate.toString(),
        checkOutDate: updatedData.checkOutDate.toString(),
      };

      await axios.patch(
        `http://localhost:3000/event/${updatedData.id}`,
        dataToSend
      );
      alert("Reservation Data Updated Successfully");
      fetchData();
      setEditData(null);
    } catch (error) {
      console.error("Error updating data:", error);
      alert("There was an error updating the reservation.");
    }
  };

  const handleFormSave = async (formData) => {
    try {
      let response;
      if (formData.type === "Request") {
        response = await post("/request", {
          eventId: selectedEventId,
          item: formData.item,
          quantity: formData.quantity,
          employeeId: formData.employeeId,
          requestTime: formData.requestTime,
          executionTime: formData.executionTime,
          returnDate: formData.returnDate,
        });
      } else {
        response = await post("/feedback", {
          eventId: selectedEventId,
          comment: formData.comment,
          category: formData.category,
        });
      }

      const id = response.data.data._id;
      await axios.patch(`http://localhost:3000/event/${selectedEventId}`, {
        [formData.type.toLowerCase() + "Id"]: id,
      });

      alert(`${formData.type} submitted and linked to event successfully!`);
      fetchData();
      setShowForm(false);
    } catch (error) {
      console.error(`Error submitting ${formData.type.toLowerCase()}:`, error);
      alert(`Error submitting ${formData.type.toLowerCase()}.`);
    }
  };

  const renderActionsCell = (params) => (
    <div>
      <button onClick={() => handleUpdate(params.row)}>
        <img src={logoUpdate} alt="update" className="scale-150 px-4" />
      </button>
      <button onClick={() => handleDelete(params.row.id)}>
        <img src={logoDelete} alt="delete" className="scale-150 px-4" />
      </button>
      <button
        onClick={() => {
          setSelectedEventId(params.row.id);
          setShowForm(true);
        }}
        className="bg-secondary-300 hover:bg-secondary-500 text-white px-2 rounded"
      >
        Req & Feed
      </button>
    </div>
  );

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "guestName", headerName: "Name", width: 200 },
    { field: "waNumber", headerName: "WhatsApp", width: 130 },
    { field: "roomNumber", headerName: "Room", width: 130 },
    { field: "checkInDate", headerName: "Check-in Date", width: 150 },
    { field: "checkOutDate", headerName: "Check-out Date", width: 150 },
    { field: "guestPurpose", headerName: "Purpose", width: 130 },
    { field: "escorting", headerName: "Escorting", width: 130 },
    { field: "guestPriority", headerName: "Priority", width: 130 },
    { field: "voucherNumber", headerName: "Voucher Number", width: 130 },
    { field: "plateNumber", headerName: "Plate Number", width: 130 },
    { field: "employeeName", headerName: "Employee", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: renderActionsCell,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-center">
        {editData && (
          <UpdateForm
            data={editData}
            onSave={handleSave}
            onCancel={() => setEditData(null)}
          />
        )}
      </div>
      <div className="flex justify-center">
        {showForm && (
          <RequestAndFeedbackForm
            onSave={handleFormSave}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>

      {rowSelectionModel.length > 0 && (
        <button
          className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded my-4"
          onClick={handleBulkDelete}
        >
          Delete Selected
        </button>
      )}
      <h2 className="text-2xl font-semibold mb-4">Reservations</h2>
      <div className="overflow-x-auto" style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
        />
      </div>
    </div>
  );
};

export default DataTable;
