import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import { Toaster } from "react-hot-toast";
import AdminLayouts from "./Layouts/AdminLayouts";
import UserLayout from "./Layouts/UserLayout";
import PublicLayouts from "./Layouts/PublicLayouts";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./redux/AuthSlice";
import LogOut from "./pages/LogOut";
import Dashboard from "./pages/Dashboard";
import Query from "./pages/Query";
// import Input from "./pages/Input";

export default function App() {
  const user = useSelector((state) => state.Auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateUser());
  }, [user]);

  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="query" element={<Query />} />
            {/* <Route path="input" element={<Input />} /> */}
            <Route path="logout" element={<LogOut />} />
          </Route>

          <Route path="/" element={<AdminLayouts />}>
            <Route index element={<Admin />} />
            <Route path="logout" element={<LogOut />} />
            <Route path="admin" element={<Admin />} />
            {/* <Route path="input" element={<Input />} /> */}
            <Route path="dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/" element={<PublicLayouts />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
