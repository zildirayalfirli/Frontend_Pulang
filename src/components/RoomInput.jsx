import React, { useState } from "react";
import Select from "react-dropdown-select";

function RoomInput({ formData, setFormData }) {
  const options = [
    { label: "option1", value: 1 },
    { label: "option2", value: 2 },
    { label: "option3", value: 3 },
  ];
  const [selectedRoom, setSelectedRoom] = useState();

  function handleSelect(event) {
    setSelectedRoom(event.target.value);
  }

  return (
    <div className="p-4 w-full">
      <div className="mb-4">
        <label className="block text-gray-700">Room Number:</label>
        <Select
          name="room"
          options={options}
          onChange={(selectedRoom) => setSelectedRoom(selectedRoom)}
          searchable="true"
        ></Select>
      </div>
    </div>
  );
}

export default RoomInput;
