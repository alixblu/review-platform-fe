import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts
import AccountLayout from "./Layout/AccountLayout";
import AdminLayout from "./Layout/AdminLayout";
import UserLayout from "./Layout/UserLayout";

// Pages
import LoginPage from "./Page/LoginPage";
import ForgetPasswordPage from "./Page/ForgetPasswordPage";
import ResetPasswordPage from "./Page/ResetPasswordPage";
import ProfilePage  from "./Page/ProfilePage";
import ProductDetail from "./Page/ProductDetail";
import ReviewPage from "./Page/ReviewPage";
import ListReviewPage from "./Page/ListReviewPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Các trang login/signup/... dùng AccountLayout */}
        <Route element={<AccountLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Các trang user */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<h1>User Home</h1>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/list-review" element={<ListReviewPage />} />
        </Route>

        {/* Các trang admin */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<h1>Admin Dashboard</h1>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
