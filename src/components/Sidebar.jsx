import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logologin from '../assets/Logo-pulang-hitam 1.svg';

export default function Sidebar() {
  const user = useSelector((state) => state.Auth.user);

  return (
    <div className="sidebar bg-secondary-300 text-white w-64 h-full border-r-2 border-black fixed z-10">
      <div className="sidebar-header p-4 font-bold">
      <div className='py-6 flex justify-center border-b-2'>
        <img src={logologin} alt="logo login" className="w-2/3 h-auto" />
      </div>
      </div>
      <div className="sidebar-content py-4">
        <ul>
          <li className="mb-2">
            <Link to="/" className="hover:bg-secondary-500 p-4 block">Upload Data</Link>
          </li>
          {user?.role === 'admin' ? (
            <>
              <li className="mb-2">
                <Link to="/dashboard" className="hover:bg-secondary-500 p-4 block">Dashboard</Link>
              </li>
              <li className="mb-2">
                <Link to="/input" className="hover:bg-secondary-500 p-4 block">Input</Link>
              </li>
              <li className="mb-2">
                <Link to="/admin" className="hover:bg-secondary-500 p-4 block">Manage Users</Link>
              </li>
              <li className="mb-2">
                <Link to="/logout" className="hover:bg-secondary-500 p-4 block">Log Out</Link>
              </li>
            </>
          ) : (
            <>
              <li className="mb-2">
                <Link to="/input" className="hover:bg-secondary-500 p-4 block">Input</Link>
              </li>
              <li className="mb-2">
                <Link to="/logout" className="hover:bg-secondary-500 p-4 block">Log Out</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}