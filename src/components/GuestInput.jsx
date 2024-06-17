import React, { useState } from "react";

function GuestInput({ formData, setFormData }) {
  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-gray-700">Name:</label>
        <input
          type="text"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.guestName}
          onChange={(event) =>
            setFormData({ ...formData, guestName: event.target.value })
          }
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Whatsapp:</label>
        <input
          type="number"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={formData.waNumber}
          onChange={(event) =>
            setFormData({ ...formData, waNumber: event.target.value })
          }
        />
      </div>
    </div>
  );
}

export default GuestInput;
