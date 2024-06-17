import React from "react";

const DateInput = ({ CI, setCI, CO, setCO }) => {
  const handleCIChange = (e) => setCI(e.target.value);
  const handleCOChange = (e) => setCO(e.target.value);

  return (
    <div className="p-4 w-full">
      <div className="mb-4">
        <label className="block text-gray-700">Check In:</label>
        <input
          type="date"
          value={CI}
          onChange={handleCIChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <label className="block text-gray-700">Check Out:</label>
        <input
          type="date"
          value={CO}
          onChange={handleCOChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default DateInput;
