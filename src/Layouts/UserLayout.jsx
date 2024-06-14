import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function UserLayout() {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="flex bg-primary-300">
      <Sidebar />
      <div className="flex-1 ml-64 p-4">
        <Outlet />
      </div>
    </div>
  );
}
