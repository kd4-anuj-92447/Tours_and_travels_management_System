import { Routes, Route } from "react-router-dom";

import Login from "./components/Pages/Login";
import Register from "./components/Pages/Register";
import Logout from "./components/Pages/Logout";
import AboutContact from "./components/Pages/AboutContact";

import AdminLayout from "./components/layouts/AdminLayout";
import AgentLayout from "./components/layouts/AgentLayout";
import CustomerLayout from "./components/layouts/CustomerLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<AboutContact />} />
      <Route path="/logout" element={<Logout />} />

      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/agent/*" element={<AgentLayout />} />
      <Route path="/customer/*" element={<CustomerLayout />} />
    </Routes>
  );
}
