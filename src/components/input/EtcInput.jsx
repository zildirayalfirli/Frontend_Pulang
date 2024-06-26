import React, { useState } from "react";
import Select from "react-dropdown-select";
import axios from "axios";

const EtcInput = ({ formData, setFormData }) => {
  const [priorityData, setPriorityData] = useState({
    elder: "",
    child: "",
    disabled: "",
    pregnant: "",
  });
  const purposeOptions = [
    { label: "Honeymoon", value: "Honeymoon" },
    { label: "Leisure", value: "Leisure" },
    { label: "Education", value: "Education" },
    { label: "Business", value: "Business" },
  ];
  const escortOptions = [
    { label: "Escorted to Elevator", value: "Escorted to Elevator" },
    { label: "Escorted to Room", value: "Escorted to Room" },
    { label: "Refused", value: "Refused" },
    { label: "Repeater", value: "Repeater" },
    { label: "No Escort", value: "No Escort" },
  ];

  function handlePurposeSelect(selectedPurposes) {
    const selectedPurpose = selectedPurposes[0].value;
    setFormData({ ...formData, guestPurpose: selectedPurpose });
  }
  function handleEscortSelect(selectedEscorts) {
    const selectedEscort = selectedEscorts[0].value;
    setFormData({ ...formData, escorting: selectedEscort });
  }
  const handlePriorityChange = (event) => {
    const { name, value } = event.target;
    const updatedPriorityData = { ...priorityData, [name]: value };
    setPriorityData(updatedPriorityData);
    const mergedPriorityData = `Elder: ${updatedPriorityData.elder}, Child: ${updatedPriorityData.child}, Disabled: ${updatedPriorityData.disabled}, Pregnant: ${updatedPriorityData.pregnant}`;
    setFormData({ ...formData, guestPriority: mergedPriorityData });
  };

  return (
    <div className="p-4 w-full">
      <div className="mb-4">
        <label className="block text-gray-700">Guest Purpose:</label>
        <Select
          name="purpose"
          options={purposeOptions}
          onChange={handlePurposeSelect}
          searchable="true"
          color="orange"
          className="mb-4 "
        ></Select>
        <label className="block text-gray-700">Escorting:</label>
        <Select
          name="escorting"
          options={escortOptions}
          onChange={handleEscortSelect}
          searchable="true"
          color="orange"
          className="mb-4 "
        ></Select>
        <label className="block text-gray-700">
          Welcome Drink Voucher Number:
        </label>
        <input
          type="text"
          className="mt-1 mb-4 block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.voucherNumber}
          onChange={(event) =>
            setFormData({ ...formData, voucherNumber: event.target.value })
          }
        />
        <label className="block text-gray-700">Guest Priority:</label>
        <div className="flex flex-row mb-4">
          <label className="block text-gray-700 mr-[8px]">Elder:</label>
          <input
            type="number"
            name="elder"
            value={priorityData.elder}
            onChange={handlePriorityChange}
            className="flex mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <label className="block text-gray-700 mx-[8px]">Child:</label>
          <input
            type="number"
            name="child"
            value={priorityData.child}
            onChange={handlePriorityChange}
            className="flex mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <label className="block text-gray-700 mx-[8px]">Disabled:</label>
          <input
            type="number"
            name="disabled"
            value={priorityData.disabled}
            onChange={handlePriorityChange}
            className="flex mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <label className="block text-gray-700 mx-[8px]">Pregnant:</label>
          <input
            type="number"
            name="pregnant"
            value={priorityData.pregnant}
            onChange={handlePriorityChange}
            className="flex mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <label className="block text-gray-700">Plate Number:</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-secondary-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.plateNumber}
          onChange={(event) =>
            setFormData({
              ...formData,
              plateNumber: event.target.value.toUpperCase(),
            })
          }
        />
      </div>
    </div>
  );
};

export default EtcInput;
