import React, { useState } from "react";
import { X } from "lucide-react";

const BrandFormModal = ({ onClose, onSave, brand }) => {
  const [formData, setFormData] = useState({
    name: brand?.name || "",
    country: brand?.country || "",
    website: brand?.website || "",
    status: brand?.status || "active",
    logo: brand?.logo || "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      const preview = URL.createObjectURL(file);
      setFormData({ ...formData, logo: preview });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          {brand ? "Chỉnh sửa Thương hiệu" : "Thêm mới Thương hiệu"}
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tên</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#FF9090]"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Quốc gia</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#FF9090]"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#FF9090]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Logo</label>
            <input type="file" name="logo" onChange={handleChange} />
            {formData.logo && (
              <img
                src={formData.logo}
                alt="Preview"
                className="w-24 h-24 mt-2 rounded-xl object-contain border"
              />
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Trạng thái</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-[#FF9090]"
            >
              <option value="active">Hoạt động</option>
              <option value="hidden">Ẩn</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-3 bg-[#FF9090] text-white py-2 rounded-xl shadow hover:bg-[#ff7d7d]"
          >
            {brand ? "Cập nhật" : "Thêm mới"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BrandFormModal;