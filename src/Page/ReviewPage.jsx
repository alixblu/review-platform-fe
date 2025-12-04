import React, { useState } from "react";
import { Star, Plus } from "lucide-react";

export default function ReviewPage() {
  // ---- USER OBJECT ----
  const user = {
    id: "3e9c3ad9-4582-4c55-bb8d-fb57c9d1f123",
    acc_id: "6b812d93-91f9-4c98-bf91-d5a37c56a912",
    name: "Dương Văn A",
    age: 25,
    gender: "male",
    profile_pic: "https://via.placeholder.com/80",
    account: {
      id: "6b812d93-91f9-4c98-bf91-d5a37c56a912",
      email: "duongvana@g0.mail.com",
      username: "duongvana",
      role: "customer",
      status: "active",
    },
  };

  // ---- PRODUCT OBJECT ----
  const product = {
    id: "8b7a3b0c-13a1-44f2-bb22-abc123456789",
    name: "Kem dưỡng da A",
    brand: { id: "b3a5d2e9-0001-44d5-b0d1-xyz987654321", name: "Hãng B" },
    category: "Skincare",
    ingredients: "Water, Glycerin, Niacinamide, Vitamin E",
    description: "Kem dưỡng da giúp làm sáng và cấp ẩm cho da khô.",
    concern_type: ["Dry Skin", "Aging"],
    skin_type: ["Dry", "Sensitive"],
    image_url: [
      "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
      "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
      "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
      "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
    ],
    price: 999000,
    rating: 3.5,
    status: "active",
  };

  // ---- STATE ----
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [images, setImages] = useState([]);

  // ---- HANDLERS ----
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileURLs = files.map((f) => URL.createObjectURL(f));
    setImages([...images, ...fileURLs]);
  };

  const handleSubmit = () => {
    const newReview = {
      id: crypto.randomUUID(),
      user_id: user.id,
      product_id: product.id,
      rating: rating,
      description: reviewText,
      img_url: images,
      create_at: new Date().toISOString(),
      status: "pending",
    };

    console.log("📝 New Review:", newReview);
    alert("Đã gửi đánh giá của bạn!");
  };

  // ---- RENDER ----
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-10">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-6xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border border-pink-100">
        {/* LEFT SIDE - PRODUCT INFO */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
          <p className="text-sm text-gray-500 mb-3">{product.brand.name}</p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {product.image_url.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={product.name}
                className="rounded-lg shadow border object-cover"
              />
            ))}
          </div>

          {/* Rating display */}
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
            <span className="ml-2 text-gray-600 text-sm">
              {product.rating}/5
            </span>
          </div>

          <p className="text-gray-700 text-sm mb-2">
            Giá: <strong>{product.price.toLocaleString()}đ</strong>
          </p>
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          <p className="text-gray-500 text-xs">
            <strong>Thành phần:</strong> {product.ingredients}
          </p>
        </div>

        {/* RIGHT SIDE - REVIEW FORM */}
        <div className="border border-pink-200 rounded-xl p-4">
          {/* User Info */}
          <div className="flex items-center mb-4">
            <img
              src={user.profile_pic}
              alt={user.name}
              className="w-12 h-12 rounded-full mr-3 object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.account.email}</p>
              <p className="text-xs text-gray-400">
                @{user.account.username} • {user.gender === "male" ? "Nam" : "Nữ"}
              </p>
            </div>
          </div>

          {/* Rating stars */}
          <div className="flex gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                onClick={() => setRating(i + 1)}
                className={`w-6 h-6 cursor-pointer ${
                  i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Review text */}
          <textarea
            placeholder="Bạn đang nghĩ gì?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 h-28 text-sm focus:outline-pink-400"
          />

          {/* Image upload */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Ảnh đính kèm:
            </p>
            <div className="flex gap-3 flex-wrap">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`attachment-${i}`}
                  className="w-16 h-16 rounded-lg border object-cover"
                />
              ))}

              <label className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-pink-300 rounded-lg cursor-pointer hover:bg-pink-50">
                <Plus className="text-pink-400" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            className="mt-6 bg-pink-400 hover:bg-pink-500 text-white font-semibold py-2 px-6 rounded-lg transition w-full"
          >
            Đăng
          </button>
        </div>
      </div>
    </div>
  );
}
