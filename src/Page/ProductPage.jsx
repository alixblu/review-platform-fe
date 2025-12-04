import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./../Component/ProductCard";

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterSkin, setFilterSkin] = useState("all");
  const [filterConcern, setFilterConcern] = useState("all");

  const [sortType, setSortType] = useState("default");

  const [categories, setCategories] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [concerns, setConcerns] = useState([]);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8888";

    axios
      .get(`${apiUrl}/api/product`)
      .then((res) => {
        const list = res.data.result || [];
        setProducts(list);

        // Lấy danh mục
        const uniqueCategories = [
          ...new Set(list.map((p) => p.categoryEnum).filter(Boolean)),
        ];
        setCategories(uniqueCategories);

        // Lấy tất cả skin types
        const uniqueSkin = [
          ...new Set(
            list.flatMap((p) => p.skinTypeEnum || [])
          ),
        ];
        setSkinTypes(uniqueSkin);

        // Lấy tất cả concern types
        const uniqueConcern = [
          ...new Set(
            list.flatMap((p) => p.concernTypeEnum || [])
          ),
        ];
        setConcerns(uniqueConcern);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy sản phẩm:", err);
        setProducts([]);
      });
  }, []);

  const filterAndSort = (items) => {
    let filtered = items || [];

    // Lọc theo category
    if (filterCategory !== "all") {
      filtered = filtered.filter((p) => p.categoryEnum === filterCategory);
    }

    // Lọc theo skin type
    if (filterSkin !== "all") {
      filtered = filtered.filter((p) =>
        p.skinTypeEnum?.includes(filterSkin)
      );
    }

    // Lọc theo concern
    if (filterConcern !== "all") {
      filtered = filtered.filter((p) =>
        p.concernTypeEnum?.includes(filterConcern)
      );
    }

    // Sort
    if (sortType === "asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortType === "desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

    return filtered;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* --- Bộ Lọc --- */}
      <div className="bg-white p-3 rounded-md shadow-sm flex flex-col gap-4 mb-4">

        {/* CATEGORY */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-medium">Danh mục:</span>

          <button
            className={
              filterCategory === "all"
                ? "bg-[#FF9090] text-white px-3 py-1 rounded-full"
                : "border px-3 py-1 rounded-full hover:border-[#FF9090]"
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
                  ? "bg-[#FF9090] text-white px-3 py-1 rounded-full"
                  : "border px-3 py-1 rounded-full hover:border-[#FF9090]"
              }
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SKIN TYPE */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-medium">Skin Type:</span>

          <button
            className={
              filterSkin === "all"
                ? "bg-[#FF9090] text-white px-3 py-1 rounded-full"
                : "border px-3 py-1 rounded-full hover:border-[#FF9090]"
            }
            onClick={() => setFilterSkin("all")}
          >
            All
          </button>

          {skinTypes.map((s) => (
            <button
              key={s}
              className={
                filterSkin === s
                  ? "bg-[#FF9090] text-white px-3 py-1 rounded-full"
                  : "border px-3 py-1 rounded-full hover:border-[#FF9090]"
              }
              onClick={() => setFilterSkin(s)}
            >
              {s}
            </button>
          ))}
        </div>

        {/* CONCERN TYPE */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-medium">Concern:</span>

          <button
            className={
              filterConcern === "all"
                ? "bg-[#FF9090] text-white px-3 py-1 rounded-full"
                : "border px-3 py-1 rounded-full hover:border-[#FF9090]"
            }
            onClick={() => setFilterConcern("all")}
          >
            All
          </button>

          {concerns.map((c) => (
            <button
              key={c}
              className={
                filterConcern === c
                  ? "bg-[#FF9090] text-white px-3 py-1 rounded-full"
                  : "border px-3 py-1 rounded-full hover:border-[#FF9090]"
              }
              onClick={() => setFilterConcern(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* SORT */}
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

      {/* Danh Sách Sản Phẩm */}
      {filterAndSort(products).length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-10">
          Không có sản phẩm nào phù hợp.
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
