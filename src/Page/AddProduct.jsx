import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, Upload, Loader } from 'lucide-react';
import Button from '../Component/UI/Button';
import Card, { CardHeader, CardBody } from '../Component/UI/Card';
import Input from '../Component/UI/Input';
import { createProduct } from '../services/productService';
import { getAllBrands } from '../services/brandService';
import { uploadImage, validateImageFile } from '../services/uploadService';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    brand_id: '',
    categoryEnum: 'CLEANSER',
    ingredients: '',
    skinTypeEnum: [],
    concernTypeEnum: [],
    description: '',
    imageUrl: '',
    price: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await getAllBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error loading brands:', error);
      } finally {
        setLoadingBrands(false);
      }
    };
    fetchBrands();
  }, []);

  // Categories options
  const categories = [
    { value: 'CLEANSER', label: 'Sữa rửa mặt' },
    { value: 'TONER', label: 'Toner' },
    { value: 'MOISTURIZER', label: 'Kem dưỡng ẩm' },
    { value: 'SERUM', label: 'Serum' },
    { value: 'SUNSCREEN', label: 'Kem chống nắng' },
    { value: 'MASK', label: 'Mặt nạ' },
    { value: 'FOUNDATION', label: 'Kem nền' },
    { value: 'LIPSTICK', label: 'Son môi' },
    { value: 'EYESHADOW', label: 'Phấn mắt' },
    { value: 'MASCARA', label: 'Mascara' },
    { value: 'SHAMPOO', label: 'Dầu gội' },
    { value: 'CONDITIONER', label: 'Dầu xả' },
  ];

  // Skin types
  const skinTypes = [
    { value: 'OILY', label: 'Da dầu' },
    { value: 'DRY', label: 'Da khô' },
    { value: 'COMBINATION', label: 'Da hỗn hợp' },
    { value: 'NORMAL', label: 'Da thường' },
    { value: 'SENSITIVE', label: 'Da nhạy cảm' },
  ];

  // Concern types (theo backend enum)
  const concernTypes = [
    { value: 'ACNE', label: 'Mụn' },
    { value: 'DARK_SPOTS', label: 'Thâm nám' },
    { value: 'FINE_LINES', label: 'Nếp nhăn nhỏ' },
    { value: 'AGING', label: 'Lão hóa' },
    { value: 'LARGE_PORES', label: 'Lỗ chân lông to' },
    { value: 'UNEVEN_TEXTURE', label: 'Kết cấu không đều' },
    { value: 'REDNESS', label: 'Đỏ da' },
    { value: 'DULLNESS', label: 'Xỉn màu' },
    { value: 'PIGMENTATION', label: 'Tăng sắc tố' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => {
      const array = prev[field];
      const newArray = array.includes(value)
        ? array.filter(item => item !== value)
        : [...array, value];
      return { ...prev, [field]: newArray };
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrors(prev => ({ ...prev, imageUrl: validation.error }));
      return;
    }

    try {
      setUploadingImage(true);
      setErrors(prev => ({ ...prev, imageUrl: '' }));

      const imageUrl = await uploadImage(file, 'product');
      setFormData(prev => ({ ...prev, imageUrl }));
    } catch (err) {
      console.error('Upload error:', err);
      setErrors(prev => ({ 
        ...prev, 
        imageUrl: 'Upload ảnh thất bại. Vui lòng thử lại.' 
      }));
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên sản phẩm không được để trống';
    }

    if (!formData.brand_id.trim()) {
      newErrors.brand_id = 'Thương hiệu không được để trống';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Mô tả không được để trống';
    }

    if (!formData.ingredients.trim()) {
      newErrors.ingredients = 'Thành phần không được để trống';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'URL hình ảnh không được để trống';
    }

    if (formData.skinTypeEnum.length === 0) {
      newErrors.skinTypeEnum = 'Vui lòng chọn ít nhất 1 loại da';
    }

    if (formData.concernTypeEnum.length === 0) {
      newErrors.concernTypeEnum = 'Vui lòng chọn ít nhất 1 vấn đề da';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API
      const productData = {
        name: formData.name,
        brand_id: formData.brand_id,
        categoryEnum: formData.categoryEnum,
        ingredients: formData.ingredients,
        skinTypeEnum: formData.skinTypeEnum,
        concernTypeEnum: formData.concernTypeEnum,
        description: formData.description,
        imageUrl: formData.imageUrl,
        price: parseInt(formData.price),
      };

      await createProduct(productData);

      // Success - navigate back to home
      alert('Thêm sản phẩm thành công!');
      navigate('/');
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Quay lại trang chủ</span>
      </button>

      <Card padding="lg">
        <CardHeader>
          <h1 className="text-3xl font-display font-bold text-neutral-800">
            Thêm sản phẩm mới
          </h1>
          <p className="text-neutral-600 mt-2">
            Điền thông tin chi tiết về sản phẩm
          </p>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <Input
              label="Tên sản phẩm *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ví dụ: Moisturizing Cream"
              error={errors.name}
              fullWidth
            />

            {/* Brand Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Thương hiệu *
              </label>
              {loadingBrands ? (
                <div className="flex items-center justify-center py-3 text-neutral-500">
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Đang tải thương hiệu...
                </div>
              ) : (
                <select
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white ${
                    errors.brand_id ? 'border-red-500' : 'border-neutral-200'
                  }`}
                >
                  <option value="">-- Chọn thương hiệu --</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.brand_id && (
                <p className="mt-1.5 text-sm text-red-500">{errors.brand_id}</p>
              )}
              {!loadingBrands && brands.length === 0 && (
                <p className="mt-1.5 text-sm text-amber-600">
                  Chưa có thương hiệu nào. Vui lòng tạo thương hiệu trước.
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Danh mục *
              </label>
              <select
                name="categoryEnum"
                value={formData.categoryEnum}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <Input
              label="Giá (VNĐ) *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="199000"
              error={errors.price}
              fullWidth
            />

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Hình ảnh sản phẩm *
              </label>
              
              <div className="space-y-3">
                {/* Upload Button */}
                <div className="flex items-center gap-3">
                  <label className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                    uploadingImage 
                      ? 'border-primary-300 bg-primary-50' 
                      : 'border-neutral-300 hover:border-primary-500 hover:bg-primary-50'
                  }`}>
                    {uploadingImage ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin text-primary-600" />
                        <span className="text-primary-600 font-medium">Đang upload...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-neutral-500" />
                        <span className="text-neutral-600 font-medium">
                          {formData.imageUrl ? 'Thay đổi ảnh' : 'Chọn ảnh'}
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Manual URL Input (optional) */}
                <Input
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="Hoặc nhập URL ảnh trực tiếp"
                  disabled={uploadingImage}
                  fullWidth
                />
              </div>

              {errors.imageUrl && (
                <p className="mt-1.5 text-sm text-red-500">{errors.imageUrl}</p>
              )}

              {/* Preview Image */}
              {formData.imageUrl && !uploadingImage && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-neutral-700 mb-2">Preview:</p>
                  <div className="relative inline-block">
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-48 h-48 object-cover rounded-xl border-2 border-neutral-200 shadow-soft"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200?text=Invalid+Image';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Mô tả *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả chi tiết về sản phẩm..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  errors.description ? 'border-red-500' : 'border-neutral-200'
                }`}
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Thành phần *
              </label>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Water, Glycerin, Hyaluronic Acid..."
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  errors.ingredients ? 'border-red-500' : 'border-neutral-200'
                }`}
              />
              {errors.ingredients && (
                <p className="mt-1.5 text-sm text-red-500">{errors.ingredients}</p>
              )}
            </div>

            {/* Skin Type */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Loại da phù hợp * (Chọn nhiều)
              </label>
              <div className="flex flex-wrap gap-2">
                {skinTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleArrayToggle('skinTypeEnum', type.value)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      formData.skinTypeEnum.includes(type.value)
                        ? 'bg-secondary-500 text-white shadow-soft'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              {errors.skinTypeEnum && (
                <p className="mt-1.5 text-sm text-red-500">{errors.skinTypeEnum}</p>
              )}
            </div>

            {/* Concern Type */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Vấn đề da giải quyết * (Chọn nhiều)
              </label>
              <div className="flex flex-wrap gap-2">
                {concernTypes.map(concern => (
                  <button
                    key={concern.value}
                    type="button"
                    onClick={() => handleArrayToggle('concernTypeEnum', concern.value)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      formData.concernTypeEnum.includes(concern.value)
                        ? 'bg-primary-500 text-white shadow-soft'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {concern.label}
                  </button>
                ))}
              </div>
              {errors.concernTypeEnum && (
                <p className="mt-1.5 text-sm text-red-500">{errors.concernTypeEnum}</p>
              )}
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4 border-t border-neutral-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/')}
                disabled={loading}
                fullWidth
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
                icon={<Plus className="w-4 h-4" />}
                fullWidth
              >
                Thêm sản phẩm
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddProduct;

