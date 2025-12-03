import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const renderBadges = (items, colorBg, colorText, max = 3) => {
    if (!items || items.length === 0) return null;
    const visible = items.slice(0, max);
    const hiddenCount = items.length - max;
    return (
      <div className="flex flex-wrap justify-center gap-1 mt-1">
        {visible.map((item) => (
          <span
            key={item}
            className={`text-xs ${colorBg} ${colorText} px-2 py-0.5 rounded-full`}
          >
            {item}
          </span>
        ))}
        {hiddenCount > 0 && (
          <span className={`text-xs ${colorBg} ${colorText} px-2 py-0.5 rounded-full`}>
            +{hiddenCount}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <img
        src={
          product?.imageUrl && product.imageUrl.trim() !== ""
            ? product.imageUrl
            : "/example-product.jpg"
        }
        alt={product?.name || "Sản phẩm"}
        className="w-40 h-40 mx-auto object-cover"
      />

      <h3 className="font-semibold mt-2">{product?.name || "Chưa có tên"}</h3>
      <p className="text-xs text-gray-500 mt-1">{product?.description || ""}</p>
      <p className="font-semibold mt-2">{(product?.price || 0).toLocaleString()}₫</p>

      {renderBadges(product?.skinTypeEnum, "bg-blue-200", "text-blue-800")}
      {renderBadges(product?.concernTypeEnum, "bg-red-200", "text-red-800")}

      <div className="text-yellow-400 mt-1">
        {"★".repeat(Math.round(product?.rating || 0))}
      </div>
    </div>
  );
}
