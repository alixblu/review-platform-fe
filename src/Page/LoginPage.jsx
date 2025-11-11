import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IoClose } from "react-icons/io5";
import { AnimatePresence, motion } from 'framer-motion';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true); // ✅ Toggle Login/Signup
  const navigate = useNavigate();

  const handleLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/cognito';
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

          {/* Info text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.35 }}
              className="text-center py-8"
            >
              <p className="text-gray-600">
                {isLogin 
                  ? 'Nhấn nút bên dưới để đăng nhập'
                  : 'Nhấn nút bên dưới để đăng ký'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Social login */}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleLogin}
              className="flex items-center gap-2 border px-6 py-3 rounded-xl hover:bg-pink-50 transition"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
              <span className="text-gray-700 font-medium">
                {isLogin ? 'Đăng nhập ' : 'Đăng ký'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
