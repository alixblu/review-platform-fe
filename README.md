# 🌸 BEAULITY - Beauty Review Platform

> Nền tảng review sản phẩm làm đẹp đơn giản và dễ sử dụng

![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.5-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7.0.0-646CFF?style=for-the-badge&logo=vite)

---

## 📋 Tổng Quan

Dự án này là một nền tảng review sản phẩm làm đẹp đơn giản với **2 trang chính**:

1. **Trang chủ** - Hiển thị danh sách sản phẩm
2. **Chi tiết sản phẩm** - Xem chi tiết và đánh giá sản phẩm

---

## ✨ Features

### 🏠 **Trang Chủ (HomePage)**
- Hiển thị danh sách sản phẩm với grid layout
- Hero section với search bar
- Filter theo danh mục (Chăm sóc da, Trang điểm, Chăm sóc tóc...)
- Product cards với:
  - Hình ảnh sản phẩm
  - Tên, thương hiệu, giá
  - Rating và số lượng đánh giá
  - Discount badges
  - Favorite button
  - Quick actions (Xem chi tiết, Mua hàng)
- Search functionality
- Responsive grid (1-3 columns)

### 📦 **Trang Chi Tiết Sản Phẩm (ProductDetail)**
- **Thông tin sản phẩm:**
  - Image gallery với thumbnails
  - Tên, thương hiệu, mô tả
  - Giá, discount
  - Rating tổng quan
  - Loại da phù hợp, vấn đề giải quyết
  - Thành phần
  - Size selection
  - Quantity selector
  - Add to cart button
  - Shipping options

- **Hệ thống đánh giá (Review System):**
  - Rating summary với distribution chart
  - Filter reviews theo số sao
  - Review list với:
    - User avatar và tên
    - Star rating
    - Review content
    - Review images
    - Helpful votes
    - Reply button
  - Form viết đánh giá mới:
    - Star rating selector
    - Text content
    - Image upload (planned)
    - Submit button

### 🎨 **Design System**
- Professional color palette (Primary Pink/Rose, Secondary Purple)
- Reusable UI components:
  - Button (5 variants, 3 sizes)
  - Card với hover effects
  - Input với icons và validation
  - Badge (6 variants)
  - Avatar với status
  - Modal với animations
  - Loading states
- Smooth animations với Framer Motion
- Responsive design cho mọi devices

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- npm hoặc yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd review-platform-fe

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Điền thông tin Cognito và API endpoints

# Start development server
npm run dev
```

Server sẽ chạy tại `http://localhost:3000`

---

## 📦 Tech Stack

### Core
- **React** 19.1.0 - UI library
- **React Router DOM** 7.6.3 - Routing
- **Vite** 7.0.0 - Build tool

### Styling
- **Tailwind CSS** 3.3.5 - Utility-first CSS
- **Framer Motion** 12.23.22 - Animations

### UI & Icons
- **Lucide React** 0.525.0 - Modern icons
- **React Icons** 5.5.0 - Icon library

### Authentication
- **@react-oauth/google** 0.12.2 - Google OAuth

### Utilities
- **Axios** 1.10.0 - HTTP client
- **SweetAlert2** 11.22.2 - Beautiful alerts
- **React Toastify** 11.0.5 - Toast notifications

---

## 📁 Project Structure

```
src/
├── Component/
│   └── UI/                 # Reusable UI components
│       ├── Button.jsx      # Button component
│       ├── Card.jsx        # Card component
│       ├── Input.jsx       # Input component
│       ├── Badge.jsx       # Badge component
│       ├── Avatar.jsx      # Avatar component
│       ├── Modal.jsx       # Modal component
│       ├── Loading.jsx     # Loading states
│       └── index.js        # Export all components
├── Layout/
│   └── MainLayout.jsx      # Main layout với header & footer
├── Page/
│   ├── HomePage.jsx        # Trang chủ - Danh sách sản phẩm
│   └── ProductDetail.jsx   # Chi tiết sản phẩm & Reviews
├── Style/
│   └── index.css           # Global styles & Tailwind config
├── Util/
│   └── axios.jsx           # Axios configuration
├── App.jsx                 # Main app với routing
└── main.jsx                # Entry point
```

---

## 🎨 Design System

### Color Palette
- **Primary**: Pink/Rose tones (#FF809D)
- **Secondary**: Purple accent (#8B5CF6)
- **Neutral**: Gray scale

### Components
- Button (5 variants, 3 sizes)
- Card with hover effects
- Input with icons
- Badge with variants
- Avatar with status
- Modal with animations
- Loading states

---

## 🔧 Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Linting
npm run lint         # Run ESLint
```

---

## 🌐 Environment Variables

### Option 1: Sử dụng Vite Proxy (Khuyến nghị)

Tạo file `.env` và để trống:

```env
# Để trống để sử dụng Vite proxy - Tránh lỗi CORS
VITE_BACKEND_URL=
```

✅ **Ưu điểm:**
- Không bị lỗi CORS
- Tự động proxy từ `/api/*` tới backend
- Không cần config CORS trên backend

⚠️ **Lưu ý:** Sau khi thay đổi config, **PHẢI restart dev server**!

### Option 2: Direct URL

```env
VITE_BACKEND_URL=http://localhost:8888
```

⚠️ **Yêu cầu:** Backend phải config CORS cho `http://localhost:3000`

---

## 🔧 Troubleshooting

### ❌ Lỗi CORS Upload

```
Access-Control-Allow-Origin blocked by CORS policy
```

**Fix:** Dùng Vite proxy (set `VITE_BACKEND_URL=` rồi restart server)

### ❌ Upload thành công nhưng không hiển thị

**Fix:** Đã được xử lý - Code hỗ trợ cả 2 response format

### ❌ Config không apply

**Fix:** Restart dev server (`Ctrl+C` → `npm run dev`)

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## 🎯 Key Features Implementation

### Product Browsing
1. User visits homepage
2. Views product grid với categories
3. Can search và filter products
4. Click on product để xem details

### Product Review System
1. User views product detail page
2. Sees existing reviews với ratings
3. Can filter reviews by stars
4. Clicks "Viết đánh giá" button
5. Rates product (1-5 stars)
6. Writes review text
7. Submits review
8. Review appears immediately in list

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is proprietary and confidential.

---

## 👥 Team

Được phát triển bởi team D22CQCI01N

---

## 🚦 Routes

- `/` - Trang chủ (Danh sách sản phẩm)
- `/product/:id` - Chi tiết sản phẩm và reviews
- `/add-product` - Thêm sản phẩm mới

---

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team.

---

**Version**: 2.0.0 - Simplified  
**Last Updated**: November 2025
