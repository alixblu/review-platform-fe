import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Truck, Store, Package, Heart, Share2, ChevronRight, ArrowLeft, ThumbsUp, MessageCircle, User, AlertCircle, CheckCircle, Upload, X } from "lucide-react";
import Button from "../Component/UI/Button";
import Card, { CardHeader, CardBody } from "../Component/UI/Card";
import Badge from "../Component/UI/Badge";
import Input from "../Component/UI/Input";
import Modal, { ModalBody, ModalFooter } from "../Component/UI/Modal";
import Loading from "../Component/UI/Loading";
import { getProductById } from "../services/productService";
import { getReviewsByProduct, createReview } from "../services/reviewService";
import { getAnalysisByProduct } from "../services/analysisService";
import { uploadImage } from "../services/uploadService";
import { mapProductFromAPI } from "../utils/productMapper";

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Analysis state
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);

  // Fetch product data from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiProduct = await getProductById(id);
        
        if (apiProduct) {
          const mappedProduct = mapProductFromAPI(apiProduct);
          setProduct({
            ...mappedProduct,
            image_urls: mappedProduct.images,
            concern_type: mappedProduct.concernType,
            skin_type: mappedProduct.skinType,
            originalPrice: mappedProduct.originalPrice,
          });
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Không thể tải thông tin sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const reviewsData = await getReviewsByProduct(id);
        
        // Transform API reviews to UI format
        const transformedReviews = reviewsData.map(review => ({
          id: review.id,
          user: {
            name: review.userId, // TODO: Fetch user name from user service
            avatar: `https://i.pravatar.cc/150?u=${review.userId}`,
            verified: false,
          },
          rating: review.rating,
          date: new Date(review.createAt).toLocaleDateString('vi-VN'),
          content: review.description,
          images: review.imgUrl ? [review.imgUrl] : [],
          likes: 0,
          helpful: 0,
        }));
        
        setReviews(transformedReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    if (id) {
      fetchReviews();
    }
  }, [id]);

  // Fetch ingredient analysis
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoadingAnalysis(true);
        const analysisData = await getAnalysisByProduct(id);
        setAnalysis(analysisData);
      } catch (err) {
        // 404 is expected if product doesn't have analysis yet
        if (err.response && err.response.status === 404) {
          console.log('No analysis data for this product yet');
        } else {
          console.error('Error fetching analysis:', err);
        }
        setAnalysis(null);
      } finally {
        setLoadingAnalysis(false);
      }
    };

    if (id) {
      fetchAnalysis();
    }
  }, [id]);

  // Calculate total reviews and rating distribution from actual reviews
  const totalReviews = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  // Mock reviews data (fallback if API returns empty)
  const mockReviews = [
    {
      id: 1,
      user: {
        name: "Nguyễn Thị Lan",
        avatar: "https://i.pravatar.cc/150?img=1",
        verified: true,
      },
      rating: 5,
      date: "2 ngày trước",
      content: "Kem dưỡng ẩm rất tốt, thấm nhanh không gây bết dính. Da mềm mịn sau 1 tuần sử dụng. Mình rất thích mùi hương nhẹ nhàng của sản phẩm.",
      images: [
        "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
        "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
      ],
      likes: 24,
      helpful: 18,
    },
    {
      id: 2,
      user: {
        name: "Trần Minh Anh",
        avatar: "https://i.pravatar.cc/150?img=5",
        verified: true,
      },
      rating: 4,
      date: "5 ngày trước",
      content: "Sản phẩm tốt nhưng hơi đắt. Dùng được khoảng 2 tuần thấy da cải thiện rõ rệt. Đóng gói đẹp, giao hàng nhanh.",
      images: [
        "https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg",
      ],
      likes: 15,
      helpful: 12,
    },
    {
      id: 3,
      user: {
        name: "Lê Hoàng Nam",
        avatar: "https://i.pravatar.cc/150?img=12",
        verified: false,
      },
      rating: 5,
      date: "1 tuần trước",
      content: "Mình là nam giới, da hơi nhạy cảm. Dùng kem này thấy rất phù hợp, không bị kích ứng. Sẽ mua tiếp!",
      images: [],
      likes: 8,
      helpful: 6,
    },
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  
  // Update selected image when product loads
  useEffect(() => {
    if (product && product.image_urls && product.image_urls.length > 0) {
      setSelectedImage(product.image_urls[0]);
    }
  }, [product]);
  
  const [selectedSize, setSelectedSize] = useState("3.38 oz/100 mL");
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [uploadingReviewImage, setUploadingReviewImage] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    content: '',
    imgUrl: '',
  });

  const shippingOptions = [
    {
      icon: Truck,
      title: "Miễn phí vận chuyển",
      description: "Đơn hàng từ 500.000₫",
    },
    {
      icon: Store,
      title: "Nhận tại cửa hàng",
      description: "Miễn phí trong 2 giờ",
    },
    {
      icon: Package,
      title: "Giao hàng nhanh",
      description: "Trong ngày",
    },
  ];

  const ratingFilters = [
    { id: 'all', label: 'Tất cả' },
    { id: '5', label: '5 sao' },
    { id: '4', label: '4 sao' },
    { id: '3', label: '3 sao' },
    { id: '2', label: '2 sao' },
    { id: '1', label: '1 sao' },
  ];

  // Display reviews or mockReviews if empty
  const displayReviews = reviews.length > 0 ? reviews : mockReviews;
  
  const filteredReviews = selectedRatingFilter === 'all' 
    ? displayReviews 
    : displayReviews.filter(r => r.rating === parseInt(selectedRatingFilter));

  // Handle review image upload
  const handleReviewImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingReviewImage(true);
      const imageUrl = await uploadImage(file, 'review');
      setNewReview(prev => ({ ...prev, imgUrl: imageUrl }));
    } catch (error) {
      alert('Upload ảnh thất bại. Vui lòng thử lại.');
    } finally {
      setUploadingReviewImage(false);
    }
  };

  // Submit new review
  const handleSubmitReview = async () => {
    if (!newReview.content.trim()) {
      alert('Vui lòng nhập nội dung đánh giá');
      return;
    }

    try {
      setSubmittingReview(true);

      // TODO: Get actual userId from auth context
      const userId = 'temp-user-id';

      const reviewData = {
        userId: userId,
        productId: id,
        rating: newReview.rating,
        description: newReview.content,
        imgUrl: newReview.imgUrl || null,
      };

      const response = await createReview(reviewData);

      if (response && response.data) {
        // Add new review to list
        const newReviewItem = {
          id: response.data.id,
          user: {
            name: "Bạn",
            avatar: "https://i.pravatar.cc/150?img=20",
            verified: false,
          },
          rating: newReview.rating,
          date: "Vừa xong",
          content: newReview.content,
          images: newReview.imgUrl ? [newReview.imgUrl] : [],
          likes: 0,
          helpful: 0,
        };

        setReviews([newReviewItem, ...reviews]);
        setShowReviewModal(false);
        setNewReview({ rating: 5, content: '', imgUrl: '' });
        alert('Đánh giá của bạn đã được gửi thành công!');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Loading size="lg" text="Đang tải thông tin sản phẩm..." fullScreen />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card padding="lg" className="max-w-md mx-auto text-center">
          <p className="text-red-500 mb-4">{error || 'Không tìm thấy sản phẩm'}</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Quay lại trang chủ
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.button
        whileHover={{ x: -5 }}
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Quay lại trang chủ</span>
      </motion.button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* LEFT: Image Gallery */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
        {product.image_urls.map((thumb, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
          <img
            src={thumb}
            alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedImage === thumb
                      ? "border-2 border-primary-500 shadow-glow"
                      : "border border-neutral-200 hover:border-primary-300"
            }`}
            onClick={() => setSelectedImage(thumb)}
          />
              </motion.div>
        ))}
      </div>

      {/* Main Image */}
          <motion.div 
            className="flex-1 relative"
            layoutId="productImage"
          >
            <Card padding="none" className="overflow-hidden">
        <img
          src={selectedImage}
          alt={product.name}
                className="w-full h-[500px] object-cover"
              />
            </Card>
            
            {/* Action Buttons on Image */}
            <div className="absolute top-4 right-4 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-3 rounded-xl bg-white/90 backdrop-blur-sm shadow-medium hover:shadow-strong transition-all"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? "fill-primary-500 text-primary-500" : "text-neutral-600"
                  }`}
                />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-xl bg-white/90 backdrop-blur-sm shadow-medium hover:shadow-strong transition-all"
              >
                <Share2 className="w-5 h-5 text-neutral-600" />
              </motion.button>
            </div>
          </motion.div>
      </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col gap-6">
          {/* Brand & Status */}
          <div className="flex items-center justify-between">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-primary-600 font-semibold text-lg"
            >
              {product.brand}
            </motion.p>
            <Badge variant="success">Còn hàng</Badge>
        </div>

          {/* Product Name */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-display font-bold text-neutral-800"
          >
            {product.name}
          </motion.h1>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-neutral-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-neutral-700 font-semibold">{product.rating}</span>
            <span className="text-neutral-500">({product.reviews} đánh giá)</span>
        </div>

        {/* Price */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-baseline gap-3"
          >
            <span className="text-4xl font-bold text-primary-600">
              {product.price.toLocaleString('vi-VN')}₫
            </span>
            <span className="text-xl text-neutral-400 line-through">
              {(product.price * 1.3).toLocaleString('vi-VN')}₫
            </span>
            <Badge variant="danger" size="lg">-23%</Badge>
          </motion.div>

          {/* Description */}
          <p className="text-neutral-600 leading-relaxed">{product.description}</p>

          {/* Skin Tags */}
          <div className="space-y-3">
            <div>
              <span className="text-sm font-semibold text-neutral-700 mb-2 block">
                Loại da phù hợp:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.skin_type.map((type, idx) => (
                  <Badge key={idx} variant="secondary" size="md">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-neutral-700 mb-2 block">
                Giải quyết vấn đề:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.concern_type.map((concern, idx) => (
                  <Badge key={idx} variant="primary" size="md">
                    {concern}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Size Selection */}
        <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Kích thước:
            </label>
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
          >
              <option value="3.38 oz/100 mL">3.38 oz / 100 mL</option>
              <option value="6.76 oz/200 mL">6.76 oz / 200 mL</option>
          </select>
        </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Số lượng:
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-neutral-100 transition-colors"
                >
                  -
                </motion.button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-neutral-100 transition-colors"
                >
                  +
                </motion.button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="primary" size="lg" fullWidth>
              Thêm vào giỏ hàng
            </Button>
            <Button variant="outline" size="lg">
              Mua ngay
            </Button>
          </div>

        {/* Shipping Options */}
          <Card padding="lg">
            <h3 className="font-semibold text-neutral-800 mb-4">Phương thức giao hàng</h3>
            <div className="space-y-3">
              {shippingOptions.map((option, idx) => {
                const Icon = option.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <div className="p-2 rounded-xl bg-primary-50">
                      <Icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-neutral-800">{option.title}</p>
                      <p className="text-sm text-neutral-500">{option.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Ingredients */}
          <Card padding="lg">
            <h3 className="font-semibold text-neutral-800 mb-3">Thành phần</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">{product.ingredients}</p>
          </Card>

          {/* Ingredient Analysis */}
          {loadingAnalysis ? (
            <Card padding="lg">
              <div className="flex items-center justify-center py-8">
                <Loading size="md" />
                <span className="ml-3 text-neutral-600">Đang phân tích thành phần...</span>
              </div>
            </Card>
          ) : analysis ? (
            <Card padding="lg">
              <h3 className="font-semibold text-neutral-800 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary-600" />
                Phân tích thành phần
              </h3>
              
              <div className="space-y-4">
                {/* High Risk */}
                {analysis.highRisk && analysis.highRisk.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <h4 className="font-semibold text-red-800">Nguy cơ cao ({analysis.highRisk.length})</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.highRisk.map((ingredient, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white text-red-700 text-sm rounded-lg border border-red-300">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Average Risk */}
                {analysis.avgRisk && analysis.avgRisk.length > 0 && (
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                      <h4 className="font-semibold text-amber-800">Nguy cơ trung bình ({analysis.avgRisk.length})</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.avgRisk.map((ingredient, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white text-amber-700 text-sm rounded-lg border border-amber-300">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Low Risk */}
                {analysis.lowRisk && analysis.lowRisk.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <h4 className="font-semibold text-green-800">An toàn ({analysis.lowRisk.length})</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {analysis.lowRisk.map((ingredient, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white text-green-700 text-sm rounded-lg border border-green-300">
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card padding="lg">
              <p className="text-neutral-500 text-center py-4">
                Chưa có phân tích thành phần cho sản phẩm này
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <Card padding="lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-display font-bold text-neutral-800">
                Đánh giá sản phẩm ({totalReviews})
              </h2>
              <Button variant="primary" onClick={() => setShowReviewModal(true)}>
                Viết đánh giá
              </Button>
            </div>
          </CardHeader>

          <CardBody>
            {/* Rating Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-neutral-100">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-5xl font-bold text-neutral-800 mb-2">
                  {product.rating}
                </div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-neutral-500">
                  Dựa trên {totalReviews} đánh giá
                </p>
          </div>

              {/* Rating Distribution */}
              <div className="md:col-span-2 space-y-2">
                {ratingDistribution.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="text-sm text-neutral-600 w-12">
                      {item.stars} sao
                    </span>
                    <div className="flex-1 h-3 bg-neutral-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.5, delay: item.stars * 0.1 }}
                        className="h-full bg-yellow-400"
                      />
                    </div>
                    <span className="text-sm text-neutral-500 w-12 text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap mb-6">
              {ratingFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedRatingFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedRatingFilter === filter.id
                      ? 'bg-primary-500 text-white shadow-soft'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredReviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="pb-6 border-b border-neutral-100 last:border-0"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="w-12 h-12 rounded-full border-2 border-primary-100"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-neutral-800">
                              {review.user.name}
                            </h4>
                            {review.user.verified && (
                              <Badge variant="success" size="sm">
                                Đã mua hàng
                              </Badge>
                            )}
          </div>
                          <p className="text-sm text-neutral-500">{review.date}</p>
          </div>
        </div>

                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-neutral-300'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-neutral-700 leading-relaxed mb-4">
                        {review.content}
                      </p>

                      {review.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          {review.images.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt={`Review ${i + 1}`}
                              className="w-full aspect-square object-cover rounded-lg border border-neutral-100 cursor-pointer hover:opacity-80 transition"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Hữu ích ({review.helpful})
                          </span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Trả lời</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-500">
                  Chưa có đánh giá nào cho bộ lọc này
        </p>
      </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Viết đánh giá"
        size="md"
      >
        <ModalBody>
          <div className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Đánh giá của bạn
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  >
                    <Star
                      className={`w-8 h-8 cursor-pointer ${
                        star <= newReview.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Review Content */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Nội dung đánh giá
              </label>
              <textarea
                value={newReview.content}
                onChange={(e) =>
                  setNewReview({ ...newReview, content: e.target.value })
                }
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                rows={5}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Thêm ảnh (tùy chọn)
              </label>
              <div className="space-y-3">
                <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                  uploadingReviewImage 
                    ? 'border-primary-300 bg-primary-50' 
                    : 'border-neutral-300 hover:border-primary-500 hover:bg-primary-50'
                }`}>
                  {uploadingReviewImage ? (
                    <>
                      <Loading size="sm" />
                      <span className="text-primary-600 font-medium">Đang upload...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-neutral-500" />
                      <span className="text-neutral-600 font-medium">
                        {newReview.imgUrl ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReviewImageUpload}
                    disabled={uploadingReviewImage}
                    className="hidden"
                  />
                </label>

                {/* Preview uploaded image */}
                {newReview.imgUrl && !uploadingReviewImage && (
                  <div className="relative inline-block">
                    <img
                      src={newReview.imgUrl}
                      alt="Review preview"
                      className="w-32 h-32 object-cover rounded-lg border-2 border-neutral-200"
                    />
                    <button
                      type="button"
                      onClick={() => setNewReview(prev => ({ ...prev, imgUrl: '' }))}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="ghost" 
            onClick={() => {
              setShowReviewModal(false);
              setNewReview({ rating: 5, content: '', imgUrl: '' });
            }}
            disabled={submittingReview}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitReview}
            disabled={!newReview.content.trim() || submittingReview}
            loading={submittingReview}
          >
            {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ProductPage;
