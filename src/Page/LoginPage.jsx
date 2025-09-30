import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // ✅ Toggle Login/Signup
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (loading) return;

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu nhập lại không khớp.');
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        // Login API
        const res = await axios.post(`${BACKEND_URL}api/user/login`, {
          email: formData.email,
          password: formData.password,
        });
        toast.success('Đăng nhập thành công!');
        navigate(redirect);
      } else {
        // Signup API
        const res = await axios.post(`${BACKEND_URL}api/user/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        toast.success('Đăng ký thành công, vui lòng đăng nhập!');
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 px-4">
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl">
        
        {/* Hình ảnh bên trái */}
        <div className="hidden md:block">
          <img
            src="/login_poster.webp"
            alt="Cosmetic Poster"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Form bên phải */}
        <div className="p-10 pb-2 flex flex-col justify-center relative">
          <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <IoClose size={24} />
        </button>
          {/* Toggle nút */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-40 py-2 font-semibold rounded-l-xl transition ${
                isLogin ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`w-40 py-2 font-semibold rounded-r-xl transition ${
                !isLogin ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* AnimatePresence cho form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35 }}
              className="space-y-2"
              onSubmit={handleSubmit}
            >
              {!isLogin && (
                <div>
                  <label className="block text-gray-700 font-medium">Họ và tên</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                    className="mt-1 w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  className="mt-1 w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  className="mt-1 w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-gray-700 font-medium">Nhập lại mật khẩu</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu"
                    className="mt-1 w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition"
              >
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
              </button>
            </motion.form>
          </AnimatePresence>

          {isLogin && (
            <div className="text-right mt-3">
              <a href="/forgot-password" className="text-pink-500 hover:underline text-sm">
                Quên mật khẩu?
              </a>
            </div>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-gray-500 text-sm">Hoặc</span>
            </div>
          </div>

          {/* Social login */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => toast.info("Google login demo")}
              className="flex items-center gap-2 border px-6 py-3 rounded-xl hover:bg-pink-50 transition"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
              <span className="text-gray-700 font-medium">
                {isLogin ? 'Đăng nhập với Google' : 'Đăng ký với Google'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
