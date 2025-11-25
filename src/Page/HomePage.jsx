import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Filter, Search } from 'lucide-react';
import Card from '../Component/UI/Card';
import Button from '../Component/UI/Button';
import Badge from '../Component/UI/Badge';
import Loading from '../Component/UI/Loading';
import { getAllProducts } from '../services/productService';
import { getAllBrands } from '../services/brandService';
import { mapProductsFromAPI } from '../utils/productMapper';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch brands and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch brands first
        const brandsData = await getAllBrands();
        const brandsMap = {};
        brandsData.forEach(brand => {
          brandsMap[brand.id] = brand.name;
        });
        setBrands(brandsMap);

        // Fetch products and replace brand_id with brand name
        const apiProducts = await getAllProducts();
        const mappedProducts = mapProductsFromAPI(apiProducts).map(product => ({
          ...product,
          brand: brandsMap[product.brand] || product.brand
        }));
        setProducts(mappedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'skincare', name: 'Chăm sóc da' },
    { id: 'makeup', name: 'Trang điểm' },
    { id: 'haircare', name: 'Chăm sóc tóc' },
  ];

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-500 to-secondary-500 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl font-display font-bold mb-4">
              Khám phá sản phẩm làm đẹp
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Tìm kiếm và đánh giá những sản phẩm làm đẹp tốt nhất
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-white text-neutral-800 placeholder:text-neutral-400 shadow-strong"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Filter & Add Product Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card padding="md">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-neutral-500" />
                <span className="font-semibold text-neutral-700">Danh mục:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-5 py-2 rounded-xl font-medium transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-primary-500 text-white shadow-soft'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Add Product Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 flex justify-end"
        >
          <Button
            variant="primary"
            icon={<ShoppingCart className="w-4 h-4" />}
            onClick={() => navigate('/add-product')}
          >
            Thêm sản phẩm mới
          </Button>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loading size="lg" text="Đang tải sản phẩm..." />
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Card padding="lg" className="max-w-md mx-auto">
              <p className="text-red-500 mb-4">{error}</p>
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card padding="none" hover className="overflow-hidden h-full flex flex-col">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    {product.discount > 0 && (
                      <Badge variant="danger" size="sm">
                        -{product.discount}%
                      </Badge>
                    )}
                    {product.tags.map((tag, idx) => (
                      <Badge key={idx} variant="primary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Favorite Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-medium hover:shadow-strong transition-all"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        favorites.includes(product.id)
                          ? 'fill-primary-500 text-primary-500'
                          : 'text-neutral-600'
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Product Info */}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="text-sm text-primary-600 font-semibold mb-1">
                    {product.brand}
                  </p>
                  
                  <h3 
                    className="text-lg font-semibold text-neutral-800 mb-2 line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-semibold text-neutral-700">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-neutral-500">
                      ({product.reviews} đánh giá)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4 mt-auto">
                    <span className="text-2xl font-bold text-primary-600">
                      {product.price.toLocaleString('vi-VN')}₫
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-neutral-400 line-through">
                        {product.originalPrice.toLocaleString('vi-VN')}₫
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ShoppingCart className="w-4 h-4" />}
                    >
                      Mua
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-neutral-500 text-lg">
              Không tìm thấy sản phẩm nào phù hợp
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;

