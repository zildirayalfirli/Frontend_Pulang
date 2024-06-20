import React, { useState, useEffect } from "react";
import Select from "react-dropdown-select";
import axios from "axios";

function EmployeeInput({ formData, setFormData }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/employee")
      .then((response) => {
        const fetchedEmployees = response.data.data;
        const formattedOptions = fetchedEmployees.map((employee) => ({
          label: `${employee.employeeName} (${employee.employeeDepartment})`,
          value: employee._id,
          employeeName: employee.employeeName,
        }));
        setOptions(formattedOptions);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  function handleSelect(selectedEmployees) {
    console.log("Selected employee:", selectedEmployees);
    if (selectedEmployees.length > 0) {
      const selectedEmployee = selectedEmployees[0].employeeName;
      setFormData({ ...formData, employee: selectedEmployee });
    }
  }

  return (
    <div className="p-4 w-full">
      <div className="mb-4">
        <label className="block text-gray-700">Employee:</label>
        <Select
          name="employee"
          options={options}
          onChange={handleSelect}
          searchable="true"
        ></Select>
      </div>
    </div>
  );
}

export default EmployeeInput;
