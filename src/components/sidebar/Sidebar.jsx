import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import logologin from "../../assets/Logo-pulang-hitam 1.svg";
import logoUpload from "../../assets/upload.svg";
import logoDashboard from "../../assets/trello.svg";
import logoInput from "../../assets/edit.svg";
import logoManageUser from "../../assets/user.svg";
import logoLogout from "../../assets/log-out.svg";

export default function Sidebar() {
  const user = useSelector((state) => state.Auth.user);

  return (
    <div className="sidebar bg-secondary-300 text-white w-64 h-full fixed z-10 flex flex-col">
      <div className="sidebar-header p-4 font-bold">
        <div className="py-6 flex justify-center border-b-2">
          <img src={logologin} alt="logo login" className="w-2/3 h-auto" />
        </div>
      </div>
      <div className="sidebar-content py-4 flex-grow">
        <ul>
          <Link to="/" className="mb-2 px-4 flex hover:bg-secondary-500 items-center">
            <img src={logoUpload} alt="upload" className="scale-150" />
            <div className="p-4">Upload Data</div>
          </Link>
          {user?.role === "admin" ? (
            <>
              <Link to="/dashboard" className="mb-2 px-4 flex hover:bg-secondary-500 items-center">
                <img src={logoDashboard} alt="dashboard" className="scale-150" />
                <div className="p-4">Dashboard</div>
              </Link>
              <Link to="/input" className="mb-2 px-4 flex hover:bg-secondary-500 items-center">
                <img src={logoInput} alt="input" className="scale-150" />
                <div className="p-4">Input</div>
              </Link>
              <Link to="/admin" className="mb-2 px-4 flex hover:bg-secondary-500 items-center">
                <img src={logoManageUser} alt="manage user" className="scale-150" />
                <div className="p-4">Manage Users</div>
              </Link>
            </>
          ) : null}
          <Link to="/logout" className="mb-2 px-4 flex hover:bg-secondary-500 items-center">
            <img src={logoLogout} alt="logout" className="scale-150" />
            <div className="p-4">Log Out</div>
          </Link>
        </ul>
      </div>
    </div>
  );
}
