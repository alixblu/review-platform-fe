export default function Header() {
  return (
    <header className="flex items-center justify-between bg-white shadow px-4 py-2 fixed top-0 left-0 right-0 z-10">
      <div className="flex items-center space-x-2">
        <img src="/logo192.png" alt="Logo" className="w-10 h-10 rounded-full" />
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none w-64"
        />
      </div>
      <div className="flex space-x-4">
        <button className="p-2 hover:bg-gray-200 rounded-full text-xl">HOME</button>
        <button className="p-2 hover:bg-gray-200 rounded-full text-xl">PRODUCT</button>
      </div>
    </header>
  );
}
