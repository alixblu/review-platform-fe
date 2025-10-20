import { useEffect, useState } from "react";
import productImg from "../assets/product.png";
import axios from "axios";

export default function ProductPage() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/products/sections/")
      .then(res => setSections(res.data))
      .catch(() => {

        setSections([
          {
            sectionTitle: "Simply Effective Skincare",
            sectionSubtitle: "Thiết bị dưỡng da Hãng Nhất",
            products: Array(8).fill({
              name: "Kem dưỡng da A",
              brand: "Hãng B",
              desc: "Mô tả: adfqwelkjhlqwejhqf adfsadfsadf asdfasdfkljlh",
              img: productImg,
            }),
          },
          {
            sectionTitle: "SOL DE JANEIRO",
            sectionSubtitle:
              "Have fallen in love with this lotion. Light, fast-absorbing, non-sticky...",
            products: Array(8).fill({
              name: "Kem dưỡng da A",
              brand: "Hãng B",
              desc: "Mô tả: adfqwelkjhlqwejhqf adfsadfsadf asdfasdfkljlh",
              img: productImg,
            }),
          },
        ]);
      });
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Bộ lọc */}
      <div className="bg-white p-3 rounded-md shadow-sm flex justify-between items-center mb-4">
        <div className="space-x-3">
          <button className="bg-pink-500 text-white px-3 py-1 rounded-full">Tất cả</button>
          <button className="border px-3 py-1 rounded-full">Loại SP2</button>
          <button className="border px-3 py-1 rounded-full">Loại SP3</button>
          <button className="border px-3 py-1 rounded-full">Loại SP4</button>
        </div>
        <div>
          <label className="text-gray-600 mr-2">Lọc theo:</label>
          <select className="border rounded px-2 py-1">
            <option>Mặc định</option>
            <option>Giá tăng dần</option>
            <option>Giá giảm dần</option>
          </select>
        </div>
      </div>

      {/* Hiển thị từng section */}
      {sections.map((section, idx) => (
        <div key={idx} className="mb-10">
          {/* Banner */}
          <div className="bg-pink-300 text-white text-center py-10 rounded-md mb-6 relative">
            <h2 className="text-2xl font-semibold uppercase">{section.sectionTitle}</h2>
            <p className="text-sm mt-2">{section.sectionSubtitle}</p>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="grid grid-cols-4 gap-6">
            {section.products.map((p, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg transition"
              >
                <img src={p.img} alt={p.name} className="w-40 h-40 mx-auto" />
                <h3 className="font-semibold mt-2">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.brand}</p>
                <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
                <div className="text-yellow-400 mt-2">★★★★★</div>
                <button className="mt-3 border border-gray-400 rounded-full px-4 py-1 hover:bg-pink-100">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
