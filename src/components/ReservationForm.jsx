import React, { useState } from "react";
import GuestInput from "./GuestInput";
import RoomInput from "./RoomInput";
import EtcInput from "./EtcInput";
import EmployeeInput from "./EmployeeInput";
import DateInput from "./DateInput";

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

  const FormTitles = ["Guest", "Room", "Additional", "Employee", "Date"];

  const PageDisplay = () => {
    if (page === 0) {
      return <GuestInput formData={formData} setFormData={setFormData} />;
    } else if (page === 1) {
      return <RoomInput />;
    } else if (page === 2) {
      return <EtcInput />;
    } else if (page === 3) {
      return <EmployeeInput />;
    } else {
      return <DateInput />;
    }
  };

  return (
    <>
      <div className="text-2xl font-bold m-4">Reservation</div>
      <div className="form-container">
        <div className="header">
          <h2>{FormTitles[page]}</h2>
        </div>
        <div className="body">{PageDisplay()}</div>
        <div className="footer">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            onClick={() => {
              setPage((currPage) => currPage - 1);
            }}
            hidden={page == 0}
          >
            Prev
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded"
            onClick={() => {
              if (page === FormTitles.length - 1) {
                alert("Form Submitted");
                console.log(formData);
              } else {
                setPage((currPage) => currPage + 1);
              }
            }}
          >
            {page === FormTitles.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </>
  );
}

export default ReservationForm;
