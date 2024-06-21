import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';

export default function UserLayout() {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="flex bg-primary-300 min-h-screen w-full">
      <Sidebar />
      <div className="ml-64 p-4 w-full">
        <Outlet />
      </div>
    </div>
  );
}
