import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Loader, Globe, MapPin } from 'lucide-react';
import Button from '../Component/UI/Button';
import Card, { CardHeader, CardBody } from '../Component/UI/Card';
import Input from '../Component/UI/Input';
import Modal, { ModalBody, ModalFooter } from '../Component/UI/Modal';
import Badge from '../Component/UI/Badge';
import { getAllBrands, createBrand, updateBrand, deleteBrand } from '../services/brandService';
import { uploadImage } from '../services/uploadService';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    logoUrl: '',
    country: '',
  });

  const [errors, setErrors] = useState({});

  // Fetch brands
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const brandsData = await getAllBrands();
      setBrands(brandsData);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter brands by search query
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (brand.country && brand.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Open modal for creating new brand
  const handleCreate = () => {
    setModalMode('create');
    setFormData({
      name: '',
      description: '',
      website: '',
      logoUrl: '',
      country: '',
    });
    setErrors({});
    setShowModal(true);
  };

  // Open modal for editing brand
  const handleEdit = (brand) => {
    setModalMode('edit');
    setSelectedBrand(brand);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      website: brand.website || '',
      logoUrl: brand.logoUrl || '',
      country: brand.country || '',
    });
    setErrors({});
    setShowModal(true);
  };

  // Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      setErrors(prev => ({ ...prev, logoUrl: '' }));
      
      const logoUrl = await uploadImage(file, 'brand');
      setFormData(prev => ({ ...prev, logoUrl }));
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        logoUrl: 'Upload logo thất bại. Vui lòng thử lại.' 
      }));
    } finally {
      setUploadingLogo(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tên thương hiệu không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const brandData = {
        name: formData.name,
        description: formData.description || null,
        website: formData.website || null,
        logoUrl: formData.logoUrl || null,
        country: formData.country || null,
      };

      if (modalMode === 'create') {
        await createBrand(brandData);
        alert('Tạo thương hiệu thành công!');
      } else {
        await updateBrand(selectedBrand.id, brandData);
        alert('Cập nhật thương hiệu thành công!');
      }

      setShowModal(false);
      fetchBrands();
    } catch (error) {
      console.error('Error submitting brand:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete brand
  const handleDelete = async (brand) => {
    if (!confirm(`Bạn có chắc muốn xóa thương hiệu "${brand.name}"?`)) {
      return;
    }

    try {
      await deleteBrand(brand.id);
      alert('Xóa thương hiệu thành công!');
      fetchBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Có lỗi xảy ra khi xóa thương hiệu.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-800">
            Quản lý thương hiệu
          </h1>
          <p className="text-neutral-600 mt-1">
            Danh sách {brands.length} thương hiệu
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleCreate}
        >
          Thêm thương hiệu
        </Button>
      </div>

      {/* Search Bar */}
      <Card padding="md" className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc quốc gia..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </Card>

      {/* Brands List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-primary-600 mr-3" />
          <span className="text-neutral-600">Đang tải...</span>
        </div>
      ) : filteredBrands.length === 0 ? (
        <Card padding="lg">
          <div className="text-center py-12">
            <p className="text-neutral-500 text-lg">
              {searchQuery ? 'Không tìm thấy thương hiệu phù hợp' : 'Chưa có thương hiệu nào'}
            </p>
            {!searchQuery && (
              <Button
                variant="primary"
                className="mt-4"
                onClick={handleCreate}
              >
                Thêm thương hiệu đầu tiên
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card padding="lg" className="h-full hover:shadow-xl transition-shadow">
                  <div className="space-y-4">
                    {/* Logo & Status */}
                    <div className="flex items-start justify-between">
                      {brand.logoUrl ? (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="w-16 h-16 object-contain rounded-lg border border-neutral-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center">
                          <span className="text-2xl font-bold text-neutral-400">
                            {brand.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <Badge 
                        variant={brand.status === 'ACTIVE' ? 'success' : 'danger'}
                        size="sm"
                      >
                        {brand.status === 'ACTIVE' ? 'Hoạt động' : 'Ẩn'}
                      </Badge>
                    </div>

                    {/* Brand Info */}
                    <div>
                      <h3 className="text-xl font-semibold text-neutral-800 mb-1">
                        {brand.name}
                      </h3>
                      {brand.description && (
                        <p className="text-sm text-neutral-600 line-clamp-2">
                          {brand.description}
                        </p>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-2">
                      {brand.country && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <MapPin className="w-4 h-4" />
                          <span>{brand.country}</span>
                        </div>
                      )}
                      {brand.website && (
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Globe className="w-4 h-4" />
                          <a
                            href={brand.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary-600 transition-colors truncate"
                          >
                            {brand.website}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-4 border-t border-neutral-100">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Edit className="w-4 h-4" />}
                        onClick={() => handleEdit(brand)}
                        fullWidth
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        icon={<Trash2 className="w-4 h-4" />}
                        onClick={() => handleDelete(brand)}
                        fullWidth
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'create' ? 'Thêm thương hiệu mới' : 'Chỉnh sửa thương hiệu'}
        size="md"
      >
        <ModalBody>
          <div className="space-y-4">
            {/* Brand Name */}
            <Input
              label="Tên thương hiệu *"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ví dụ: The Ordinary"
              error={errors.name}
              fullWidth
            />

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Logo
              </label>
              <div className="space-y-3">
                <label className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
                  uploadingLogo 
                    ? 'border-primary-300 bg-primary-50' 
                    : 'border-neutral-300 hover:border-primary-500 hover:bg-primary-50'
                }`}>
                  {uploadingLogo ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin text-primary-600" />
                      <span className="text-primary-600 font-medium">Đang upload...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 text-neutral-500" />
                      <span className="text-neutral-600 font-medium">
                        {formData.logoUrl ? 'Thay đổi logo' : 'Chọn logo'}
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="hidden"
                  />
                </label>

                {formData.logoUrl && !uploadingLogo && (
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.logoUrl}
                      alt="Logo preview"
                      className="w-20 h-20 object-contain rounded-lg border-2 border-neutral-200"
                    />
                  </div>
                )}
              </div>
              {errors.logoUrl && (
                <p className="mt-1.5 text-sm text-red-500">{errors.logoUrl}</p>
              )}
            </div>

            {/* Country */}
            <Input
              label="Quốc gia"
              name="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              placeholder="Ví dụ: Canada"
              fullWidth
            />

            {/* Website */}
            <Input
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
              fullWidth
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả về thương hiệu..."
                rows={4}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            variant="ghost" 
            onClick={() => setShowModal(false)}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting || !formData.name.trim()}
            loading={submitting}
          >
            {submitting 
              ? 'Đang lưu...' 
              : modalMode === 'create' ? 'Tạo mới' : 'Cập nhật'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default BrandManagement;

