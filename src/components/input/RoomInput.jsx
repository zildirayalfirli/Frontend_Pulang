import React, { useState, useEffect } from "react";
import Select from "react-dropdown-select";
import axios from "axios";

function RoomInput({ formData, setFormData }) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios
      .get("http://192.168.1.141:3000/room")
      .then((response) => {
        const fetchedRooms = response.data.data;
        const formattedOptions = fetchedRooms.map((room) => ({
          label: `Room ${room.roomNumber} (${room.roomType})`,
          value: room._id,
        }));
        setOptions(formattedOptions);
      })
      .catch((error) => {
        console.error("Error fetching room data:", error);
      });
  }, []);

  function handleSelect(selectedRooms) {
    console.log("Selected Rooms:", selectedRooms);
    if (selectedRooms.length > 0) {
      // Extract the room number from the selected option
      const selectedRoomNumber = selectedRooms[0].label
        .replace("Room ", "")
        .split(" ")[0];
      setFormData({ ...formData, roomNumber: selectedRoomNumber });
    }
  }

  return (
    <div className="p-4 w-full">
      <div className="mb-4">
        <label className="block text-gray-700">Room Number:</label>
        <Select
          name="room"
          options={options}
          onChange={handleSelect}
          searchable={true}
          color="orange"
        />
      </div>
    </div>
  );
}

export default RoomInput;
