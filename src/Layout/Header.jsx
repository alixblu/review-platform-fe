import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [showAdmin, setShowAdmin] = useState(false);

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    
    // Call logout API
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8888";
    
    // Redirect to logout endpoint which will redirect back to login
    window.location.href = `${apiUrl}/logout`;
  };

  const navLink =
    "px-4 py-2 rounded-full text-gray-700 font-medium hover:bg-gray-100 transition";

  return (
    <header className="flex justify-between items-center bg-white shadow-md px-6 py-3 fixed top-0 left-0 right-0 z-20">
      {/* LOGO + SEARCH */}
      <div className="flex items-center space-x-3">
        <Link to="/feed">
          <img
            src="login_poster.webp"
            alt="Logo"
            className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition"
          />
        </Link>

        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="bg-gray-100 rounded-full px-4 py-2 text-sm w-64 focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* MENU */}
      <div className="flex items-center space-x-4">
        <Link className={navLink} to="/feed">
          HOME
        </Link>
        <Link className={navLink} to="/product">
          PRODUCT
        </Link>
        <Link className={navLink} to="/profile">
          PROFILE
        </Link>
        {/* <Link className={navLink} to="/reviews">
          REVIEWS
        </Link> */}

        {/* ADMIN DROPDOWN */}
        <div
          className="relative"
          onMouseEnter={() => setShowAdmin(true)}
          onMouseLeave={() => setShowAdmin(false)}
        >
          <button className="px-4 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition">
            ADMIN
          </button>

          {showAdmin && (
            <div
              className="
                absolute top-full right-0 
                w-48 bg-white rounded-lg shadow-lg 
                py-2 border z-50
                animate-fade-in
              "
            >
              <Link
                to="/admin/product"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                Manage Products
              </Link>

              <Link
                to="/admin/product/add"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                Add Product
              </Link>

              <Link
                to="/admin/users"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                Manage Users
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm transition"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}
