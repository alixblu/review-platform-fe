import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const api = import.meta.env.VITE_API_URL || "http://localhost:8888";

    axios
      .get(`${api}/api/product`)
      .then((res) => {
        setProducts(res.data.result || []);
      })
      .catch((err) => {
        console.error("Lỗi lấy sản phẩm:", err);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <button
          onClick={() => navigate("/admin/product/new")}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Thêm sản phẩm
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border">Ảnh</th>
              <th className="p-2 border">Tên</th>
              <th className="p-2 border">Giá</th>
              <th className="p-2 border">Danh mục</th>
              <th className="p-2 border">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  <img
                    src={p.imageUrl || "https://via.placeholder.com/80"}
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>

                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">
                  {(p.price || 0).toLocaleString()}₫
                </td>
                <td className="p-2 border">{p.categoryEnum}</td>

                <td className="p-2 border">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 mr-2"
                    onClick={() => navigate(`/admin/product/edit/${p.id}`)}
                  >
                    Sửa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            Không có sản phẩm nào.
          </p>
        )}
      </div>
    </div>
  );
}
