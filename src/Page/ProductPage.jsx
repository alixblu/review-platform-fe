import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortType, setSortType] = useState("default");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // hook chuyển hướng

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8888";
    axios.get(`${apiUrl}/api/products/sections/`)
      .then(res => setSections(res.data))
      .catch(() => {

        const uniqueCategories = Array.from(
          new Set(allProducts.map((p) => p?.categoryEnum).filter(Boolean))
        );
        setCategories(uniqueCategories);
      })
      .catch((err) => console.error("Lỗi khi lấy sản phẩm:", err));
  }, []);

  const filterAndSort = (items) => {
    let filtered = items || [];
    if (filterCategory !== "all") {
      filtered = filtered.filter((p) => p?.categoryEnum === filterCategory);
    }
    if (sortType === "asc")
      filtered = [...filtered].sort(
        (a, b) => (a?.price || 0) - (b?.price || 0)
      );
    else if (sortType === "desc")
      filtered = [...filtered].sort(
        (a, b) => (b?.price || 0) - (a?.price || 0)
      );
    return filtered;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Bộ lọc */}{" "}
      <div className="bg-white p-3 rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        {" "}
        <div className="space-x-2">
          <button
            className={
              filterCategory === "all"
                ? "bg-pink-500 text-white px-3 py-1 rounded-full"
                : "border px-3 py-1 rounded-full"
            }
            onClick={() => setFilterCategory("all")}
          >
            Tất cả{" "}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={
                filterCategory === cat
                  ? "bg-pink-500 text-white px-3 py-1 rounded-full"
                  : "border px-3 py-1 rounded-full"
              }
              onClick={() => setFilterCategory(cat)}
            >
              {cat}{" "}
            </button>
          ))}{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="text-gray-600 mr-2">Sắp xếp theo:</label>
          <select
            className="border rounded px-2 py-1"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            {" "}
            <option value="default">Mặc định</option>{" "}
            <option value="asc">Giá tăng dần</option>{" "}
            <option value="desc">Giá giảm dần</option>{" "}
          </select>{" "}
        </div>{" "}
      </div>
      {/* Danh sách sản phẩm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filterAndSort(products).map((p) => (
          <div
            key={p?.id}
            className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/product/${p.id}`)} // chuyển hướng khi click
          >
            <img
              src={p?.imageUrl || "https://via.placeholder.com/150"}
              alt={p?.name || "Sản phẩm"}
              className="w-40 h-40 mx-auto object-cover"
            />
            <h3 className="font-semibold mt-2">{p?.name || "Chưa có tên"}</h3>
            <p className="text-xs text-gray-500 mt-1">{p?.description || ""}</p>
            <p className="font-semibold mt-2">
              {(p?.price || 0).toLocaleString()}₫
            </p>
            <div className="flex justify-center mt-1 space-x-1">
              {(p?.skinTypeEnum || []).map((skin) => (
                <span
                  key={skin}
                  className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full"
                >
                  {skin}
                </span>
              ))}
              {(p?.concernTypeEnum || []).map((concern) => (
                <span
                  key={concern}
                  className="text-xs bg-red-200 text-red-800 px-2 py-0.5 rounded-full"
                >
                  {concern}
                </span>
              ))}
            </div>
            <div className="text-yellow-400 mt-1">
              {"★".repeat(Math.round(p?.rating || 0))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
