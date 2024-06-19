import React, { useState } from "react";
import ReservationForm from "../components/ReservationForm";

const Input = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-primary-100 rounded-lg border-2 border-[#EE7F2B]">
      <div className="flex-grow w-2/5">
        <ReservationForm />
      </div>
    </div>
  );
};

export default Input;
