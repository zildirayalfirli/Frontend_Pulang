import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logologin from "../../assets/Logo-pulang-hitam 1.svg";
import logoUpload from "../../assets/upload.svg";
import logoDashboard from "../../assets/trello.svg";
// import logoInput from "../../assets/edit.svg";
import logoManageUser from "../../assets/user.svg";
import logoLogout from "../../assets/log-out.svg";
import logoOpenAI from "../../assets/openai.svg";

export default function Sidebar() {
  const user = useSelector((state) => state.Auth.user);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="sidebar bg-secondary-300 text-white w-64 h-full fixed z-10 flex flex-col shadow-lg">
      <div className="sidebar-header py-6 flex justify-center border-b border-secondary-500">
        <img src={logologin} alt="Pulang Logo" className="w-2/3 h-auto" />
      </div>

      <div className="sidebar-content py-4 flex-grow">
        <ul className="space-y-2">
          <li>
            <Link
              to="/"
              className={`flex items-center px-4 py-3 rounded-lg transition ${isActive("/") ? "bg-secondary-500" : "hover:bg-secondary-500"}`}
            >
              <img src={logoUpload} alt="Upload" className="w-6 h-6" />
              <span className="ml-3 text-sm font-medium">Upload Data</span>
            </Link>
          </li>

          {user?.role === "admin" && (
            <>
              <li>
                <Link
                  to="/dashboard"
                  className={`flex items-center px-4 py-3 rounded-lg transition ${
                    isActive("/dashboard") ? "bg-secondary-500" : "hover:bg-secondary-500"
                  }`}
                >
                  <img src={logoDashboard} alt="Dashboard" className="w-6 h-6" />
                  <span className="ml-3 text-sm font-medium">Dashboard</span>
                </Link>
              </li>

              {/* <li>
              <Link to="/input" className="mb-2 px-4 flex hover:bg-secondary-500 items-center">
                <img src={logoInput} alt="input" className="scale-150" />
                <div className="p-4">Input</div>
              </Link>
              </li> */}

              <li>
                <Link
                  to="/admin"
                  className={`flex items-center px-4 py-3 rounded-lg transition ${
                    isActive("/admin") ? "bg-secondary-500" : "hover:bg-secondary-500"
                  }`}
                >
                  <img src={logoManageUser} alt="Manage Users" className="w-6 h-6" />
                  <span className="ml-3 text-sm font-medium">Manage Users</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/query"
                  className={`flex items-center px-4 py-3 rounded-lg transition ${
                    isActive("/query") ? "bg-secondary-500" : "hover:bg-secondary-500"
                  }`}
                >
                  <img src={logoOpenAI} alt="OpenAI" className="w-6 h-6" />
                  <span className="ml-3 text-sm font-medium">Query Assistant</span>
                </Link>
              </li>
            </>
          )}

          <li>
            <Link
              to="/logout"
              className={`flex items-center px-4 py-3 rounded-lg transition ${isActive("/logout") ? "bg-secondary-500" : "hover:bg-secondary-500"}`}
            >
              <img src={logoLogout} alt="Log Out" className="w-6 h-6" />
              <span className="ml-3 text-sm font-medium">Log Out</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
