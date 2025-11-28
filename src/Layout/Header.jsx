import React from 'react';
import { Link } from 'react-router-dom'; // 1. Import Link

export default function Header() {
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("authData");
    window.location.href = "http://localhost:8888/logout";
  };

  // Class chung cho các link menu để code gọn hơn
  const navLinkClass = "p-2 hover:bg-gray-200 rounded-full text-lg font-medium transition-colors text-gray-700";

  return (
    <header className="flex items-center justify-between bg-white shadow px-4 py-2 fixed top-0 left-0 right-0 z-10">
      {/* --- Phần Logo & Search --- */}
      <div className="flex items-center space-x-2">
        {/* Thêm Link vào Logo để bấm vào quay về trang chủ */}
        <Link to="/feed"> 
          <img src="/logo192.png" alt="Logo" className="w-10 h-10 rounded-full cursor-pointer" />
        </Link>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none w-64"
        />
      </div>

      {/* --- Phần Menu Navigation --- */}
      <div className="flex space-x-4 items-center">
        {/* 2. Dẫn tới các trang tương ứng */}
        <Link to="/feed" className={navLinkClass}>HOME</Link>
        <Link to="/product" className={navLinkClass}>PRODUCT</Link>
        
        {/* 3. Thêm Profile và Review */}
        <Link to="/profile" className={navLinkClass}>PROFILE</Link>
        <Link to="/reviews" className={navLinkClass}>REVIEWS</Link>

        <button 
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full text-sm font-medium transition-colors ml-2"
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
}