import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./../Component/ProductCard";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortType, setSortType] = useState("default");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8888";

    axios
      .get(`${apiUrl}/api/product`)
      .then((res) => {
        const list = res.data.result || [];
        setProducts(list);

        const uniqueCategories = Array.from(
          new Set(list.map((p) => p?.categoryEnum).filter(Boolean))
        );
        setCategories(uniqueCategories);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy sản phẩm:", err);
        setProducts([]);
      });
  }, []);

  const filterAndSort = (items) => {
    let filtered = items || [];
    if (filterCategory !== "all") {
      filtered = filtered.filter((p) => p?.categoryEnum === filterCategory);
    }
    if (sortType === "asc")
      filtered = [...filtered].sort((a, b) => (a?.price || 0) - (b?.price || 0));
    else if (sortType === "desc")
      filtered = [...filtered].sort((a, b) => (b?.price || 0) - (a?.price || 0));
    return filtered;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Bộ lọc */}
      <div className="bg-white p-3 rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="space-x-2">
          <button
            className={
              filterCategory === "all"
                ? "bg-pink-500 text-white px-3 py-1 rounded-full"
                : "border px-3 py-1 rounded-full"
            }
            onClick={() => setFilterCategory("all")}
          >
            Tất cả
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
              {cat}
            </button>
          ))}
        </div>

        <div>
          <label className="text-gray-600 mr-2">Sắp xếp theo:</label>
          <select
            className="border rounded px-2 py-1"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="default">Mặc định</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      {filterAndSort(products).length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          Không có sản phẩm nào.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filterAndSort(products).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
