import React, { useState } from "react";
import Select from "react-dropdown-select";

function EmployeeInput({ formData, setFormData }) {
  const options = [
    { label: "option1", value: 1 },
    { label: "option2", value: 2 },
    { label: "option3", value: 3 },
  ];
  const [selectedEmployee, setSelectedEmployee] = useState();

  function handleSelect(event) {
    setSelectedEmployee(event.target.value);
  }

  return (
    <div className="p-4 w-full">
      <div className="mb-4">
        <label className="block text-gray-700">Employee:</label>
        <Select
          name="employee"
          options={options}
          onChange={(selectedEmployee) => setSelectedEmployee(selectedEmployee)}
          searchable="true"
        ></Select>
      </div>
    </div>
  );
}

export default EmployeeInput;
