import React, { useState } from "react";
import GuestInput from "./GuestInput";
import RoomInput from "./RoomInput";
import EtcInput from "./EtcInput";
import EmployeeInput from "./EmployeeInput";
import DateInput from "./DateInput";
import axios from "axios";

function ReservationForm() {
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({
    guestName: "",
    waNumber: "",
    roomNumber: "",
    guestPurpose: "",
    escorting: "",
    voucherNumber: "",
    guestPriority: "",
    plateNumber: "",
    employee: "",
    checkIn: "",
    checkOut: "",
  });

  const FormPages = [
    { title: "Guest", info: null },
    {
      title: "Room",
      info: [
        { label: "Guest Name", value: formData.guestName },
        { label: "Whatsapp", value: formData.waNumber },
      ],
    },
    {
      title: "Additional",
      info: [
        { label: "Guest Name", value: formData.guestName },
        { label: "Whatsapp", value: formData.waNumber },
        { label: "Room", value: formData.roomNumber },
      ],
    },
    {
      title: "Employee",
      info: [
        { label: "Guest Name", value: formData.guestName },
        { label: "Whatsapp", value: formData.waNumber },
        { label: "Room", value: formData.roomNumber },
        { label: "Purpose", value: formData.guestPurpose },
        { label: "Escorting", value: formData.escorting },
        { label: "Voucher Number", value: formData.voucherNumber },
        { label: "Priority", value: formData.guestPriority },
        { label: "Plate Number", value: formData.plateNumber },
      ],
    },
    {
      title: "Date",
      info: [
        { label: "Guest Name", value: formData.guestName },
        { label: "Whatsapp", value: formData.waNumber },
        { label: "Room", value: formData.roomNumber },
        { label: "Purpose", value: formData.guestPurpose },
        { label: "Escorting", value: formData.escorting },
        { label: "Voucher Number", value: formData.voucherNumber },
        { label: "Priority", value: formData.guestPriority },
        { label: "Plate Number", value: formData.plateNumber },
        { label: "Employee", value: formData.employee },
      ],
    },
    {
      title: "Summary",
      info: [
        { label: "Guest Name", value: formData.guestName },
        { label: "Whatsapp", value: formData.waNumber },
        { label: "Room", value: formData.roomNumber },
        { label: "Purpose", value: formData.guestPurpose },
        { label: "Escorting", value: formData.escorting },
        { label: "Voucher Number", value: formData.voucherNumber },
        { label: "Priority", value: formData.guestPriority },
        { label: "Plate Number", value: formData.plateNumber },
        { label: "Employee", value: formData.employee },
        { label: "Check In", value: formData.checkIn },
        { label: "Check Out", value: formData.checkOut },
      ],
    },
  ];

  const PageDisplay = () => {
    if (page === 0) {
      return <GuestInput formData={formData} setFormData={setFormData} />;
    } else if (page === 1) {
      return <RoomInput formData={formData} setFormData={setFormData} />;
    } else if (page === 2) {
      return <EtcInput formData={formData} setFormData={setFormData} />;
    } else if (page === 3) {
      return <EmployeeInput formData={formData} setFormData={setFormData} />;
    } else if (page === 4) {
      return <DateInput formData={formData} setFormData={setFormData} />;
    }
  };

  const handleSubmit = async () => {
    try {
      const guestResponse = await axios.post(
        "http://192.168.1.141:3000/guest",
        {
          guestName: formData.guestName,
          waNumber: formData.waNumber,
        }
      );

      const guestId = guestResponse.data.data._id;

      const roomResponse = await axios.get(
        `http://192.168.1.141:3000/room/bynumber?roomNumber=${formData.roomNumber}`
      );

      const roomId = roomResponse.data.data._id;

      const employeeResponse = await axios.get(
        `http://192.168.1.141:3000/employee/byname?employeeName=${formData.employee}`
      );

      const employeeId = employeeResponse.data.data._id;

      if (!guestId || !roomId || !employeeId) {
        alert("Failed to fetch IDs. Please check the responses.");
        return;
      }

      // Create the final data object to send to the event API
      const dataToSend = {
        guestId: guestId,
        roomId: roomId,
        guestPurpose: formData.guestPurpose,
        escorting: formData.escorting,
        voucherNumber: formData.voucherNumber,
        guestPriority: formData.guestPriority,
        plateNumber: formData.plateNumber,
        employeeId: employeeId,
        checkInDate: formData.checkIn,
        checkOutDate: formData.checkOut,
      };

      // Post data to the event API
      const eventResponse = await axios.post(
        "http://192.168.1.141:3000/event",
        dataToSend
      );
      console.log("Event Response:", eventResponse.data); // Log respons untuk event
      alert("Form Submitted Successfully");
    } catch (error) {
      alert("Error submitted form");
      console.error("There was an error submitting the reservation:", error);
    }
    window.location.reload();
  };

  return (
    <>
      <div className="form-container border-2 p-4 border-secondary-300 rounded-lg shadow-lg">
        <div className="header mb-[8px]">
          <h2 className="text-heading-6 flex justify-center mb-4">
            {FormPages[page].title}
          </h2>
          <div
            style={{ whiteSpace: "pre-line" }}
            className="grid grid-cols-2 gap-[8px] "
          >
            {FormPages[page].info &&
              FormPages[page].info.map((item, index) => (
                <div key={index} className="contents">
                  <strong>{item.label}: </strong>
                  <span>{item.value}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="body my-[24px]">{PageDisplay()}</div>
        <div className="footer">
          <button
            className="bg-primary-500 hover:bg-tertiary-100 text-white px-4 py-2 rounded mr-2"
            onClick={() => {
              setPage((currPage) => currPage - 1);
            }}
            hidden={page == 0}
          >
            Prev
          </button>
          <button
            className="bg-secondary-300 hover:bg-secondary-500 text-white px-4 py-2 rounded"
            onClick={() => {
              if (page === FormPages.length - 1) {
                handleSubmit();
              } else {
                setPage((currPage) => currPage + 1);
              }
            }}
          >
            {page === FormPages.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ReservationForm;
