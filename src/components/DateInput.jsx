import React from "react";

function DateInput({ formData, setFormData }) {
  function handleCiSelect(event) {
    const selectedCi = event.target.value;
    setFormData({ ...formData, checkIn: selectedCi });
  }
  function handleCoSelect(event) {
    const selectedCo = event.target.value;
    setFormData({ ...formData, checkOut: selectedCo });
  }

  return (
    <div className="p-4 w-full">
      <div className="mb-4">
        <label className="block text-gray-700">Check In:</label>
        <input
          type="date"
          value={formData.checkIn}
          onChange={handleCiSelect}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <label className="block text-gray-700">Check Out:</label>
        <input
          type="date"
          value={formData.checkOut}
          onChange={handleCoSelect}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
}

export default DateInput;
