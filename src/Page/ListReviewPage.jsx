import React from "react";
import { Star } from "lucide-react";

export default function ProductReviewList() {
  // 🧱 Product mẫu
  const product = {
    id: "8b7a3b0c-13a1-44f2-bb22-abc123456789",
    name: "Kem dưỡng da A",
    brand: "Hãng B",
    price: 999000,
    description: "Mô tả: Kem dưỡng ẩm, làm mềm và sáng da tự nhiên.",
    rating: 3.5,
    images: [
      "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
      "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
      "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
      "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
    ],
  };

  // 👥 Danh sách review mẫu
  const reviews = [
    {
      id: 1,
      rating: 5,
      content:
        "Kem dùng rất tốt, thấm nhanh, không gây bết dính. Dùng 1 tuần thấy da mềm hơn rõ.",
      images: [
        "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
        "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
      ],
      user: {
        name: "Tên người dùng A",
        profile_pic: "https://i.pravatar.cc/80?img=11",
      },
    },
    {
      id: 2,
      rating: 4,
      content:
        "Mùi hơi nồng nhưng chất kem mịn, dễ tán. Mình dùng 2 tuần thấy sáng hơn chút.",
      images: [
        "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
        "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
      ],
      user: {
        name: "Tên người dùng B",
        profile_pic: "https://i.pravatar.cc/80?img=5",
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">

        {/* LEFT: Product info */}
        <div className="bg-white border border-pink-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
          <p className="text-sm text-gray-500 mb-3">{product.brand}</p>

          {/* Product images */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {product.images.map((img, i) => (
              <img key={i} src={img} alt={product.name} className="rounded-lg shadow border" />
            ))}
          </div>

          {/* Product rating */}
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(product.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600 text-sm">{product.rating}/5</span>
          </div>

          <p className="text-gray-700 text-sm mb-2">
            <strong>Giá:</strong> {product.price.toLocaleString()}đ
          </p>

          <p className="text-gray-600 text-sm">{product.description}</p>
        </div>

        {/* RIGHT: Review list */}
        <div className="flex flex-col gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-pink-200 rounded-xl p-5 shadow-sm"
            >
              <div className="flex items-center mb-3">
                <img
                  src={rev.user.profile_pic}
                  alt="avatar"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <h3 className="font-semibold text-gray-800">{rev.user.name}</h3>
              </div>

              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < rev.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 text-sm mb-3">{rev.content}</p>

              <div className="grid grid-cols-3 gap-2">
                {rev.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`review-${i}`}
                    className="rounded-md border shadow-sm"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
