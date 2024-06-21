import React, { useState } from "react";
import ReservationForm from "../components/ReservationForm";
import DataTable from "../components/DataTable";
import RequestAndFeedbackTable from "../components/RequestAndFeedbackTable";

const Input = () => {
  const [showForm, setShowForm] = useState(false);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="h-auto max-w-[1600px] min-h-screen flex flex-col items-center bg-primary-100 rounded-lg border-2 border-[#EE7F2B] py-6">
      <div className="text-heading-2 font-bold m-4 flex justify-center">
        Reservation
      </div>
      <div className="w-full flex justify-start pl-4 ml-[300px]">
        <button
          onClick={toggleForm}
          className="bg-secondary-300 hover:bg-secondary-500 text-white px-4 py-2 rounded-lg mb-4"
        >
          {showForm ? "Hide Reservation Form" : "Show Reservation Form"}
        </button>
      </div>
      {showForm && (
        <div className="w-2/5 flex-grow mb-4 mb-8">
          <ReservationForm />
        </div>
      )}
      <div className="w-full p-8">
        <DataTable />
      </div>
      <div className="w-full p-8">
        <RequestAndFeedbackTable />
      </div>
    </div>
  );
};

export default Input;
