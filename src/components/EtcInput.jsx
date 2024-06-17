import React, { useState } from "react";
import logoAdd from "../assets/Add Button.svg";
import Select from "react-dropdown-select";

const EtcInput = ({ formData, setFormData }) => {
  const options = [
    { label: "option1", value: 1 },
    { label: "option2", value: 2 },
    { label: "option3", value: 3 },
  ];
  const [selectedPurpose, setSelectedPurpose] = useState();
  const [selectedEscort, setSelectedEscort] = useState();

  function handleSelectPurpose(event) {
    setSelectedPurpose(event.target.value);
  }
  function handleSelectEscort(event) {
    setSelectedEscort(event.target.value);
  }

  return (
    <div className="p-4 w-3/4">
      <div className="mb-4">
        <label className="block text-gray-700">Guest Purpose:</label>
        <Select
          name="purpose"
          options={options}
          onChange={(selectedPurpose) => setSelectedPurpose(selectedPurpose)}
          searchable="true"
        ></Select>
        <label className="block text-gray-700">Escorting:</label>
        <Select
          name="escorting"
          options={options}
          onChange={(selectedEscort) => setSelectedEscort(selectedEscort)}
          searchable="true"
        ></Select>
        <label className="block text-gray-700">
          Welcome Drink Voucher Number:
        </label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          // value={formData.voucherNumber}
          onChange={(event) =>
            setFormData({ ...formData, voucherNumber: event.target.value })
          }
        />
        <label className="block text-gray-700">Guest Priority:</label>
        <img src={logoAdd} alt="add" className="scale-50" />
        <label className="block text-gray-700">Plate Number:</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          // value={formData.plateNumber}
          onChange={(event) =>
            setFormData({ ...formData, plateNumber: event.target.value })
          }
        />
      </div>
    </div>
  );
};

export default EtcInput;
