import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("3.38 oz/100 mL");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "", image: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [userNames, setUserNames] = useState({}); // Cache user names
  const [brandInfo, setBrandInfo] = useState(null); // Brand information

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8888";

  useEffect(() => {
    if (!id) return;
    
    console.log("Fetching product with ID:", id);
    console.log("API URL:", `${apiUrl}/api/product/${id}`);
    
    // Fetch product details
    axios
      .get(`${apiUrl}/api/product/${id}`)
      .then(async (res) => {
        console.log("Full API response:", res);
        console.log("Response data:", res.data);
        const data = res.data?.result;
        console.log("Extracted product data:", data);
        if (data) {
          setProduct(data);
          setSelectedImage(data.imageUrl);
          
          // Fetch brand information if brand_id exists
          if (data.brand_id) {
            try {
              const brandRes = await axios.get(`${apiUrl}/api/brand/${data.brand_id}`);
              const brandData = brandRes.data?.result;
              console.log("Brand data:", brandData);
              setBrandInfo(brandData);
            } catch (err) {
              console.error("Failed to fetch brand:", err);
            }
          }
        } else {
          console.error("No product data found in response");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy product:", err);
        console.error("Error response:", err.response);
        console.error("Request URL:", err.config?.url);
      });

    // Fetch reviews
    axios
      .get(`${apiUrl}/api/review/product/${id}`)
      .then(async (res) => {
        const reviewData = res.data?.result || [];
        console.log("Reviews data:", reviewData);
        if (reviewData.length > 0) {
          console.log("First review createAt:", reviewData[0].createAt);
          console.log("Type:", typeof reviewData[0].createAt);
        }
        setReviews(reviewData);
        
        // Fetch user names for all reviews
        const uniqueUserIds = [...new Set(reviewData.map(r => r.userId))];
        const names = {};
        
        for (const userId of uniqueUserIds) {
          try {
            const userRes = await axios.get(`${apiUrl}/api/user/${userId}`);
            const userData = userRes.data?.result;
            names[userId] = userData?.username || userData?.email || "Anonymous";
          } catch (err) {
            console.error(`Failed to fetch user ${userId}:`, err);
            names[userId] = "Anonymous";
          }
        }
        
        setUserNames(names);
      })
      .catch((err) => console.error("Lỗi khi lấy reviews:", err));
  }, [id, apiUrl]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh không được vượt quá 5MB!");
      return;
    }

    setUploadingImage(true);
    try {
      const token = sessionStorage.getItem("token") || localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(
        `${apiUrl}/api/upload/review`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const imageUrl = response.data?.result?.url;
      console.log("Image uploaded:", imageUrl);
      
      setNewReview({ ...newReview, image: imageUrl });
      setImagePreview(URL.createObjectURL(file));
      
    } catch (err) {
      console.error("Lỗi khi upload ảnh:", err);
      alert("Không thể upload ảnh. Vui lòng thử lại!");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setNewReview({ ...newReview, image: null });
    setImagePreview(null);
  };

  const handleSubmitReview = async () => {
    if (!newReview.comment.trim()) {
      alert("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      // Get token from sessionStorage (where it's stored after login)
      const token = sessionStorage.getItem("token") || 
                    localStorage.getItem("token") || 
                    localStorage.getItem("access_token");
      
      console.log("Token found:", token ? "Yes" : "No");
      console.log("Token value:", token ? token.substring(0, 20) + "..." : "null");
      
      if (!token) {
        alert("Vui lòng đăng nhập để đánh giá!");
        setIsSubmitting(false);
        return;
      }

      // Get user info from sessionStorage
      const userDataStr = sessionStorage.getItem("user") || sessionStorage.getItem("authData");
      let userId = null;
      let username = null;
      
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr);
          userId = userData.id || userData.userId || userData.sub;
          username = userData.username || userData.email;
          console.log("User ID:", userId);
          console.log("Username:", username);
        } catch (e) {
          console.error("Failed to parse user data:", e);
        }
      }
      
      if (!userId) {
        alert("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại!");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post(
        `${apiUrl}/api/review`,
        {
          userId: userId,
          productId: id,
          rating: newReview.rating,
          description: newReview.comment,
          imgUrl: newReview.image
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Review submitted successfully:", response);

      // Refresh reviews and user names
      const res = await axios.get(`${apiUrl}/api/review/product/${id}`);
      const reviewData = res.data?.result || [];
      setReviews(reviewData);
      
      // Add current user to userNames cache
      if (username) {
        setUserNames(prev => ({ ...prev, [userId]: username }));
      }
      
      setNewReview({ rating: 5, comment: "", image: null });
      setImagePreview(null);
      alert("Đánh giá thành công!");
    } catch (err) {
      console.error("Lỗi khi gửi review:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      alert(`Không thể gửi đánh giá: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Đang tải sản phẩm...</p>
          <p className="text-sm text-gray-400">Product ID: {id}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-page bg-gray-50 min-h-screen">
      {/* Product Details Section */}
      <div className="flex flex-wrap lg:flex-nowrap gap-8 p-8 bg-white">
        {/* Thumbnails */}
        <div className="thumbnails flex lg:flex-col flex-row gap-4 order-2 lg:order-1">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`w-16 h-16 object-cover border-2 rounded cursor-pointer hover:opacity-80 transition ${
                selectedImage === product.imageUrl ? "border-[#FF9090]" : "border-gray-200"
              }`}
              onClick={() => setSelectedImage(product.imageUrl)}
            />
          )}
        </div>
        
        {/* Main Image */}
        <div className="main-image flex-1 order-1 lg:order-2">
          <img
            src={selectedImage}
            alt={product.name}
            className="w-full max-w-md object-contain rounded-lg shadow-md"
          />
        </div>
        
        {/* Product Info */}
        <div className="product-info flex-1 flex flex-col gap-4 order-3">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          
          {/* Brand Information */}
          {brandInfo && (
            <div className="brand-info relative group">
              <a
                href={brandInfo.website || "#"}
                target={brandInfo.website ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#FF9090] hover:text-[#FF7070] font-medium transition-colors"
                onClick={(e) => {
                  if (!brandInfo.website) {
                    e.preventDefault();
                  }
                }}
              >
                <span>{brandInfo.name}</span>
                {brandInfo.website && (
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                    />
                  </svg>
                )}
              </a>
              
              {/* Tooltip with brand description */}
              {brandInfo.description && (
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block z-[9999] w-64 max-h-96 overflow-y-auto p-3 bg-[#FF9090] text-white text-sm rounded-lg shadow-lg">
                  <div className="relative">
                    {brandInfo.description}
                    {/* Arrow pointing down */}
                    <div className="absolute left-4 -bottom-3 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-[#FF9090]"></div>
                  </div>
                </div>
              )}
            </div>
          )}

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
              className="border p-2 rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-[#FF9090]"
            >
              <option value="3.38 oz/100 mL">3.38 oz/100 mL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Section - Full Width Below Product Details */}
      <div className="reviews-section max-w-7xl mx-auto mt-8 mb-8 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>

        {/* Review Summary */}
        <div className="review-summary bg-[#FFF0F0] rounded-lg p-6 mb-8 flex items-center gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#FF9090]">
              {product?.rating?.toFixed(1) || "0.0"}
            </div>
            <div className="text-yellow-400 text-2xl mt-2">
              {"★".repeat(Math.floor(product?.rating || 0))}
              {"☆".repeat(5 - Math.floor(product?.rating || 0))}
            </div>
            <div className="text-gray-500 text-sm mt-1">
              {reviews.length} đánh giá
            </div>
          </div>
        </div>

        {/* Write Review Form */}
        <div className="write-review bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Viết đánh giá của bạn</h3>
          
          {/* Star Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Đánh giá:</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="text-3xl focus:outline-none transition-transform hover:scale-110"
                >
                  <span className={star <= newReview.rating ? "text-yellow-400" : "text-gray-300"}>
                    ★
                  </span>
                </button>
              ))}
              <span className="ml-2 text-gray-600">({newReview.rating} sao)</span>
            </div>
          </div>

          {/* Comment */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nhận xét:</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              className="w-full border rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-[#FF9090]"
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Thêm ảnh (tùy chọn):</label>
            
            {imagePreview ? (
              <div className="relative inline-block">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border-2 border-[#FF9090]"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <div className={`px-4 py-2 border-2 border-dashed rounded-lg hover:border-[#FF9090] transition ${
                    uploadingImage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}>
                    {uploadingImage ? (
                      <span className="text-gray-500">Đang tải...</span>
                    ) : (
                      <span className="text-gray-600">Chọn ảnh</span>
                    )}
                  </div>
                </label>
                <span className="text-xs text-gray-500">Tối đa 5MB</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitReview}
            disabled={isSubmitting || uploadingImage}
            className={`px-6 py-2 rounded-lg text-white font-medium transition ${
              isSubmitting || uploadingImage
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FF9090] hover:bg-[#FF7070]"
            }`}
          >
            {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </div>

        {/* Reviews List */}
        <div className="reviews-list space-y-4">
          <h3 className="text-lg font-semibold mb-4">Tất cả đánh giá</h3>
          
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
            </p>
          ) : (
            reviews.map((review) => {
              const userName = userNames[review.userId] || "Anonymous";
              const userInitial = userName.charAt(0).toUpperCase();
              
              return (
                <div
                  key={review.id}
                  className="review-item border-b pb-4 mb-4 last:border-b-0"
                >
                  <div className="flex items-start gap-4">
                    {/* User Avatar */}
                    <div className="w-12 h-12 bg-[#FFF0F0] rounded-full flex items-center justify-center text-[#FF9090] font-bold">
                      {userInitial}
                    </div>

                    <div className="flex-1">
                      {/* User Name & Date */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{userName}</span>
                        <span className="text-sm text-gray-500">
                          {(() => {
                            try {
                              let dateStr = review.createdAt;
                              
                              console.log("Original createdAt:", dateStr, "Type:", typeof dateStr, "IsArray:", Array.isArray(dateStr));
                              
                              // If it's an array [year, month, day, hour, minute, second, nanosecond]
                              if (Array.isArray(dateStr)) {
                                const [year, month, day, hour = 0, minute = 0, second = 0] = dateStr;
                                // Note: Java month is 1-12, JavaScript Date month is 0-11, so we need to subtract 1
                                const jsDate = new Date(year, month - 1, day, hour, minute, second);
                                console.log("Converted date:", jsDate);
                                
                                if (isNaN(jsDate.getTime())) {
                                  return "Không xác định";
                                }
                                
                                return jsDate.toLocaleDateString("vi-VN", {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                });
                              }
                              
                              // If it's a string, try to parse it
                              const date = new Date(dateStr);
                              
                              if (isNaN(date.getTime())) {
                                return "Không xác định";
                              }
                              
                              return date.toLocaleDateString("vi-VN", {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                            } catch (e) {
                              console.error("Error parsing date:", e, review.createAt);
                              return "Không xác định";
                            }
                          })()}
                        </span>
                      </div>

                      {/* Rating Stars */}
                      <div className="text-yellow-400 mb-2">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>

                      {/* Comment */}
                      <p className="text-gray-700 mb-2">{review.description}</p>
                      
                      {/* Review Image */}
                      {review.imgUrl && (
                        <img 
                          src={review.imgUrl} 
                          alt="Review" 
                          className="mt-2 w-48 h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition"
                          onClick={() => window.open(review.imgUrl, '_blank')}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
