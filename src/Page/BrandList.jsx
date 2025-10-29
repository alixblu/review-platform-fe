import React, { useState } from "react";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import BrandFormModal from "./BrandFormModal";

const BrandList = () => {
  const [brands, setBrands] = useState([
    {
      id: 1,
      name: "Nike",
      country: "USA",
      website: "https://www.nike.com",
      status: "active",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    },
    {
      id: 2,
      name: "Adidas",
      country: "Germany",
      website: "https://www.adidas.com",
      status: "hidden",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    },
  ]);

  const [selectedBrand, setSelectedBrand] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleAdd = () => {
    setSelectedBrand(null);
    setOpenModal(true);
  };

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setOpenModal(true);
  };

  const handleDelete = (id) => {
    setBrands(brands.filter((b) => b.id !== id));
  };

  const handleSave = (brandData) => {
    if (selectedBrand) {
      setBrands(
        brands.map((b) => (b.id === selectedBrand.id ? { ...b, ...brandData } : b))
      );
    } else {
      setBrands([...brands, { ...brandData, id: Date.now() }]);
    }
    setOpenModal(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Quản lý Thương hiệu
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-[#FF9090] hover:bg-[#ff7d7d] text-white px-4 py-2 rounded-xl shadow-md"
        >
          <PlusCircle size={18} /> Thêm mới
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#FFF4F4] text-gray-600">
            <th className="p-3">Logo</th>
            <th className="p-3">Tên</th>
            <th className="p-3">Quốc gia</th>
            <th className="p-3">Website</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr
              key={brand.id}
              className="border-b hover:bg-[#FFF8F8] transition"
            >
              <td className="p-3">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="w-12 h-12 object-contain rounded-lg shadow-sm"
                />
              </td>
              <td className="p-3 font-medium">{brand.name}</td>
              <td className="p-3">{brand.country}</td>
              <td className="p-3 text-blue-500 underline">
                <a href={brand.website} target="_blank" rel="noreferrer">
                  {brand.website.replace("https://", "")}
                </a>
              </td>
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-xl text-sm ${
                    brand.status === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {brand.status === "active" ? "Hoạt động" : "Ẩn"}
                </span>
              </td>
              <td className="p-3 text-right flex justify-end gap-3">
                <button
                  onClick={() => handleEdit(brand)}
                  className="text-[#FF9090] hover:text-[#ff6f6f]"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openModal && (
        <BrandFormModal
          onClose={() => setOpenModal(false)}
          onSave={handleSave}
          brand={selectedBrand}
        />
      )}
    </div>
  );
};

export default BrandList;
