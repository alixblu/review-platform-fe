import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AccountLayout from "./Layout/AccountLayout";
import AdminLayout from "./Layout/AdminLayout";
import UserLayout from "./Layout/UserLayout";

// Pages
import LoginPage from "./Page/LoginPage";
import ForgetPasswordPage from "./Page/ForgetPasswordPage";
import ResetPasswordPage from "./Page/ResetPasswordPage";
import FeedPage from "./Page/FeedPage";
import ProfilePage  from "./Page/ProfilePage";
import ProductDetail from "./Page/ProductDetail";
import ReviewPage from "./Page/ReviewPage";
import ListReviewPage from "./Page/ListReviewPage";
import AuthCallback from "./Page/AuthCallback";
import ProductPage from "./Page/ProductPage";

import AdminProductPage from "./Page/AdminProductPage";
import AdminProductEdit from "./Page/AdminProductEdit";
import AdminProductCreate from "./Page/AdminProductCreate";
// Components
import FloatingChat from "./Component/FloatingChat";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route - redirect to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Account layout */}
        <Route element={<AccountLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Route>

        {/* User layout */}
        <Route element={<UserLayout />}>
          <Route path="/feed" element={<FeedPage />} /> {/* ✅ Newsfeed */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/list-review" element={<ListReviewPage />} />
        </Route>

        {/* Admin layout */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<h1>Admin Dashboard</h1>} />
          <Route path="/admin/product" element={<AdminProductPage />} />
          <Route path="/admin/product/new" element={<AdminProductCreate />} />
          <Route path="/admin/product/edit/:productId" element={<AdminProductEdit />} />
        </Route>
      </Routes>
      
      {/* Floating Chat - Available on all pages */}
      <FloatingChat />
    </Router>
  );
}

export default App;
