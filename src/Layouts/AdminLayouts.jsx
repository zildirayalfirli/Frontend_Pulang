import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/sidebar/Sidebar';

export default function AdminLayouts() {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
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
