import { Search, Bell, User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="logo" className="w-8 h-8" />
        <span className="text-2xl font-bold text-pink-500">BEAULITY</span>
      </div>

      <ul className="flex space-x-6 text-gray-700 font-medium">
        <li className="cursor-pointer hover:text-pink-500">Home</li>
        <li className="cursor-pointer hover:text-pink-500 border-b-2 border-pink-500">Product</li>
      </ul>

      <div className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border rounded-full px-4 py-1 outline-none focus:ring-2 focus:ring-pink-300"
        />
        <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
        <User className="w-5 h-5 text-gray-600 cursor-pointer" />
      </div>
    </nav>
  );
}
