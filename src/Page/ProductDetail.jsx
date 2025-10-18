import React, { useState } from "react";

const ProductPage = () => {
  const product = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    name: "Moisturizing Cream",
    brand: "Beauty of Joseon",
    category: "skincare",
    ingredients: "Water, Glycerin, Hyaluronic Acid",
    description:
      "A lightweight moisturizing cream suitable for all skin types.",
    concern_type: ["dryness", "sensitivity"],
    skin_type: ["oily", "combination"],
    image_urls: [
      "https://www.sephora.com/productimages/sku/s2896264-main-zoom.jpg?imwidth=930",
      "https://tse2.mm.bing.net/th/id/OIP.B39-1EvwOFXOffOfIKZT0AHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
      "https://tse3.mm.bing.net/th/id/OIP.L2hYEzdhlCO1usu1ragAxQHaDF?cb=12&w=1920&h=800&rs=1&pid=ImgDetMain&o=7&rm=3",
    ],
    price: 199000,
    rating: 4.5,
    status: "active",
  };

  const [selectedImage, setSelectedImage] = useState(product.image_urls[0]);
  const [selectedSize, setSelectedSize] = useState("3.38 oz/100 mL");

  return (
    <div className="product-page flex flex-wrap lg:flex-nowrap gap-8 p-8">
      {/* Thumbnails */}
      <div className="thumbnails flex lg:flex-col flex-row gap-4 order-2 lg:order-1">
        {product.image_urls.map((thumb, index) => (
          <img
            key={index}
            src={thumb}
            alt={`Thumbnail ${index + 1}`}
            className={`w-16 h-16 object-cover border rounded cursor-pointer hover:opacity-80 ${
              selectedImage === thumb ? "border-blue-500" : ""
            }`}
            onClick={() => setSelectedImage(thumb)}
          />
        ))}
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
        <h2 className="text-sm text-gray-500">{product.brand}</h2>
        <h1 className="text-2xl font-bold">{product.name}</h1>

        {/* Rating */}
        <div className="rating flex items-center gap-2 text-yellow-500">
          <span>{"★".repeat(Math.floor(product.rating))}</span>
          <span className="text-gray-700">{product.rating.toFixed(1)}</span>
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
            <strong>Concerns:</strong> {product.concern_type.join(", ")}
          </p>
          <p>
            <strong>Skin Types:</strong> {product.skin_type.join(", ")}
          </p>
        </div>

        {/* Price */}
        <p className="text-2xl font-semibold text-gray-900">
          {(product.price / 1000).toFixed(3)}₫
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

        {/* Shipping Options */}
        <div className="shipping-options grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="border p-4 text-center cursor-pointer rounded hover:shadow">
            <p>🚚</p>
            <p>
              <a href="#" className="underline">
                Sign in
              </a>{" "}
              for FREE shipping
            </p>
          </div>
          <div className="border p-4 text-center cursor-pointer rounded hover:shadow">
            <p>🛍️</p>
            <p>Same-Day Delivery</p>
          </div>
          <div className="border p-4 text-center cursor-pointer rounded hover:shadow">
            <p>🏬</p>
            <p>Buy Online & Pick Up</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          <a href="#" className="underline">
            Sign in
          </a>{" "}
          or create an account to enjoy FREE standard shipping.{" "}
          <a href="#" className="underline">
            Shipping & Returns
          </a>
        </p>
      </div>
    </div>
  );
};

export default ProductPage;
