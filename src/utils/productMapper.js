// Map API product data to UI format
export const mapProductFromAPI = (apiProduct) => {
  if (!apiProduct) return null;

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    brand: apiProduct.brand_id, // You might want to fetch brand name separately
    price: apiProduct.price,
    originalPrice: apiProduct.price * 1.3, // Calculate original price (30% discount example)
    rating: apiProduct.rating || 0,
    reviews: 0, // This should come from reviews API
    image: apiProduct.imageUrl || 'https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg',
    category: mapCategoryEnum(apiProduct.categoryEnum),
    tags: generateTags(apiProduct),
    discount: 23, // Calculate based on price difference
    skinType: apiProduct.skinTypeEnum?.map(mapSkinTypeEnum) || [],
    concernType: apiProduct.concernTypeEnum?.map(mapConcernTypeEnum) || [],
    ingredients: apiProduct.ingredients,
    description: apiProduct.description,
    status: apiProduct.status,
    images: [
      apiProduct.imageUrl || 'https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg',
      apiProduct.imageUrl || 'https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg',
      apiProduct.imageUrl || 'https://live.staticflickr.com/5615/15621128269_94ae753403_b.jpg',
    ],
  };
};

// Map category enum to Vietnamese
const mapCategoryEnum = (category) => {
  const categoryMap = {
    CLEANSER: 'skincare',
    TONER: 'skincare',
    MOISTURIZER: 'skincare',
    SERUM: 'skincare',
    SUNSCREEN: 'skincare',
    MASK: 'skincare',
    FOUNDATION: 'makeup',
    LIPSTICK: 'makeup',
    EYESHADOW: 'makeup',
    MASCARA: 'makeup',
    SHAMPOO: 'haircare',
    CONDITIONER: 'haircare',
  };
  return categoryMap[category] || 'skincare';
};

// Map skin type enum to Vietnamese
const mapSkinTypeEnum = (skinType) => {
  const skinTypeMap = {
    OILY: 'Da dầu',
    DRY: 'Da khô',
    COMBINATION: 'Da hỗn hợp',
    NORMAL: 'Da thường',
    SENSITIVE: 'Da nhạy cảm',
  };
  return skinTypeMap[skinType] || skinType;
};

// Map concern type enum to Vietnamese
const mapConcernTypeEnum = (concern) => {
  const concernMap = {
    ACNE: 'Mụn',
    DARK_SPOTS: 'Thâm nám',
    FINE_LINES: 'Nếp nhăn nhỏ',
    AGING: 'Lão hóa',
    LARGE_PORES: 'Lỗ chân lông to',
    UNEVEN_TEXTURE: 'Kết cấu không đều',
    REDNESS: 'Đỏ da',
    DULLNESS: 'Xỉn màu',
    PIGMENTATION: 'Tăng sắc tố',
  };
  return concernMap[concern] || concern;
};

// Generate tags based on product properties
const generateTags = (product) => {
  const tags = [];
  
  if (product.rating >= 4.5) {
    tags.push('Bestseller');
  }
  
  if (product.status === 'ACTIVE') {
    tags.push('Có sẵn');
  }
  
  // Add more logic for tags
  if (Math.random() > 0.7) {
    tags.push('New');
  }
  
  if (Math.random() > 0.7) {
    tags.push('Popular');
  }
  
  return tags;
};

// Map multiple products
export const mapProductsFromAPI = (apiProducts) => {
  if (!Array.isArray(apiProducts)) return [];
  return apiProducts.map(mapProductFromAPI).filter(p => p !== null);
};

