import React from "react";

export default function ProductTagPopup({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[400px] p-6 relative">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-[#FF9090] text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-xl mb-4 border-2 border-[#FF9090]"
        />
        <h2 className="text-xl font-semibold mb-1">{product.name}</h2>
        <p className="text-[#FF9090] font-bold mb-2">{product.price}</p>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <button className="w-full py-2 bg-[#FF9090] text-white rounded-xl hover:bg-[#ff7c7c] transition">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}
