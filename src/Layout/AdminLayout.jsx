import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar trái */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-lg font-semibold text-[#FF9090] mb-4">Admin</h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <a href="/admin/dashboard" className="block hover:text-[#FF9090]">Dashboard</a>
          </li>
          <li>
            <a href="/admin/brands" className="block hover:text-[#FF9090]">Quản lý Brand</a>
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
