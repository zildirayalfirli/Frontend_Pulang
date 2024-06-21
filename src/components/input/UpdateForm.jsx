import React, { useState, useEffect } from "react";
import Select from "react-dropdown-select";
import axios from "axios";

const UpdateForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState(data);
  const [rooms, setRooms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [priorityData, setPriorityData] = useState({
    elder: "",
    child: "",
    other: "",
  });

  const purposeOptions = [
    { label: "Honeymoon", value: "Honeymoon" },
    { label: "Leisure", value: "Leisure" },
    { label: "Education", value: "Education" },
    { label: "Business", value: "Business" },
  ];

  const escortOptions = [
    { label: "option1", value: "option1" },
    { label: "option2", value: "option2" },
    { label: "option3", value: "option3" },
  ];

  useEffect(() => {
    setFormData(data);
    setPriorityData(data.guestPriority || { elder: "", child: "", other: "" });
    fetchRooms();
    fetchEmployees();
  }, [data]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:3000/room");
      const roomOptions = response.data.data.map((room) => ({
        label: room.roomNumber,
        value: room._id,
      }));
      setRooms(roomOptions);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://localhost:3000/employee");
      const employeeOptions = response.data.data.map((employee) => ({
        label: `${employee.employeeName} (${employee.employeeDepartment})`,
        value: employee._id,
      }));
      setEmployees(employeeOptions);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, selected) => {
    setFormData({ ...formData, [name]: selected[0]?.label || "" });
  };

  const handlePriorityChange = (e) => {
    const { name, value } = e.target;
    setPriorityData({ ...priorityData, [name]: value });
    setFormData({
      ...formData,
      guestPriority: { ...priorityData, [name]: value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedGuestPriority = `Elder: ${
      priorityData.elder || ""
    }, Child: ${priorityData.child || ""}, Other: ${priorityData.other || ""}`;
    onSave({
      ...formData,
      guestPriority: formattedGuestPriority,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-secondary-300 shadow-lg mb-4 w-2/5">
      <h2 className="text-2xl font-semibold mb-4">Edit Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="guestName"
            value={formData?.guestName || ""}
            onChange={handleChange}
            className="w-full p-2 border border-secondary-300 rounded mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">WhatsApp:</label>
          <input
            type="text"
            name="waNumber"
            value={formData?.waNumber || ""}
            onChange={handleChange}
            className="w-full p-2 border border-secondary-300 rounded mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Room:</label>
          <Select
            options={rooms}
            onChange={(selected) => handleSelectChange("roomNumber", selected)}
            values={rooms.filter((room) => room.label === formData.roomNumber)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            color="orange"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Check-in Date:</label>
          <input
            type="date"
            name="checkInDate"
            value={formData?.checkInDate || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Check-out Date:</label>
          <input
            type="date"
            name="checkOutDate"
            value={formData?.checkOutDate || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Purpose:</label>
          <Select
            options={purposeOptions}
            onChange={(selected) =>
              handleSelectChange("guestPurpose", selected)
            }
            values={purposeOptions.filter(
              (option) => option.label === formData.guestPurpose
            )}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            color="orange"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Escorting:</label>
          <Select
            options={escortOptions}
            onChange={(selected) => handleSelectChange("escorting", selected)}
            values={escortOptions.filter(
              (option) => option.label === formData.escorting
            )}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            color="orange"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Guest Priority:</label>
          <div className="flex flex-row mb-4">
            <label className="block text-gray-700 mr-2">Elder:</label>
            <input
              type="number"
              name="elder"
              value={priorityData.elder}
              onChange={handlePriorityChange}
              className="flex mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <label className="block text-gray-700 mx-2">Child:</label>
            <input
              type="number"
              name="child"
              value={priorityData.child}
              onChange={handlePriorityChange}
              className="flex mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            <label className="block text-gray-700 mx-2">Other:</label>
            <input
              type="number"
              name="other"
              value={priorityData.other}
              onChange={handlePriorityChange}
              className="flex mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Voucher Number:</label>
          <input
            type="text"
            name="voucherNumber"
            value={formData?.voucherNumber || ""}
            onChange={handleChange}
            className="w-full p-2 border border-secondary-300 rounded mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Plate Number:</label>
          <input
            type="text"
            name="plateNumber"
            value={formData?.plateNumber || ""}
            onChange={handleChange}
            className="w-full p-2 border border-secondary-300 rounded mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Employee:</label>
          <Select
            options={employees}
            onChange={(selected) =>
              handleSelectChange("employeeName", selected)
            }
            values={employees.filter(
              (employee) => employee.label === formData.employeeName
            )}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            color="orange"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-primary-500 hover:bg-tertiary-100 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-secondary-300 hover:bg-secondary-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateForm;
