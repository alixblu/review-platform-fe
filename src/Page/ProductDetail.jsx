import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductPage = () => {
  const { id } = useParams(); // Lấy product id từ URL
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("3.38 oz/100 mL");

  useEffect(() => {
    if (!id) return;
    axios
      .get(`http://localhost:8888/api/product/${id}`)
      .then((res) => {
        const data = res.data?.result;
        if (data) {
          setProduct(data);
          setSelectedImage(data.imageUrl); // lấy image chính
        }
      })
      .catch((err) => console.error("Lỗi khi lấy product:", err));
  }, [id]);

  if (!product) return <p>Đang tải sản phẩm...</p>;

  return (
    <div className="product-page flex flex-wrap lg:flex-nowrap gap-8 p-8">
      {/* Thumbnails */}{" "}
      <div className="thumbnails flex lg:flex-col flex-row gap-4 order-2 lg:order-1">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-16 h-16 object-cover border rounded cursor-pointer hover:opacity-80 ${
              selectedImage === product.imageUrl ? "border-blue-500" : ""
            }`}
            onClick={() => setSelectedImage(product.imageUrl)}
          />
        )}{" "}
      </div>
      {/* Main Image */}
      <div className="main-image flex-1 order-1 lg:order-2">
        <img
          src={selectedImage}
          alt={product.name}
          className="w-full max-w-md object-contain rounded-lg shadow"
        />
      </div>
      {/* Product Info */}
      <div className="product-info flex-1 flex flex-col gap-4 order-3">
        <h2 className="text-sm text-gray-500">{product.brand_id}</h2>
        <h1 className="text-2xl font-bold">{product.name}</h1>

        {/* Rating */}
        <div className="rating flex items-center gap-2 text-yellow-500">
          <span>{"★".repeat(Math.floor(product.rating || 0))}</span>
          <span className="text-gray-700">
            {(product.rating || 0).toFixed(1)}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600">{product.description}</p>

        {/* Ingredients */}
        <p className="text-sm text-gray-500">
          <strong>Ingredients:</strong> {product.ingredients}
        </p>

        {/* Concern + Skin type */}
        <div className="text-sm text-gray-500">
          <p>
            <strong>Concerns:</strong>{" "}
            {(product.concernTypeEnum || []).join(", ")}
          </p>
          <p>
            <strong>Skin Types:</strong>{" "}
            {(product.skinTypeEnum || []).join(", ")}
          </p>
        </div>

        {/* Price */}
        <p className="text-2xl font-semibold text-gray-900">
          {(product.price || 0).toLocaleString()}₫
        </p>

        {/* Size selection */}
        <div>
          <label className="block mb-1 font-medium">Size:</label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="border p-2 rounded w-full max-w-xs"
          >
            <option value="3.38 oz/100 mL">3.38 oz/100 mL</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
