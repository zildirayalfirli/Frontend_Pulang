import React, { useState, useEffect } from "react";
import Select from "react-dropdown-select";
import { get } from "../../services/ApiEndpoint";

const ReqUpdateForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState(data);
  const [employees, setEmployees] = useState([]);

  const fetchEmployees = async () => {
    try {
      const response = await get("/employee");
      const employeeOptions = response.data.data.map((employee) => ({
        label: `${employee.employeeName} (${employee.employeeDepartment})`,
        value: employee._id,
      }));
      setEmployees(employeeOptions);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    setFormData(data);
    fetchEmployees();
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, selected) => {
    setFormData({ ...formData, [name]: selected[0]?.label || "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-secondary-300 shadow-lg mb-4 w-2/5">
      <h2 className="text-2xl font-semibold mb-4">Edit Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Item:</label>
          <input
            type="text"
            name="item"
            value={formData.item}
            onChange={handleChange}
            required
            className="w-full p-2 border border-secondary-300 rounded mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full p-2 border border-secondary-300 rounded mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Request Time:</label>
          <input
            type="datetime-local"
            name="requestTime"
            value={formData.requestTime}
            onChange={handleChange}
            required
            className="w-full p-2 border border-secondary-300 rounded mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Execution Time:</label>
          <input
            type="datetime-local"
            name="executionTime"
            value={formData.executionTime}
            onChange={handleChange}
            required
            className="w-full p-2 border border-secondary-300 rounded mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Employee:</label>
          <Select
            options={employees}
            onChange={(selected) => handleSelectChange("employeeId", selected)}
            values={employees.filter(
              (employee) => employee.value === formData.employeeId
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

export default ReqUpdateForm;
