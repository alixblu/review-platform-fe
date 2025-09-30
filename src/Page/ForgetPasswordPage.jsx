import { useState } from "react";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import axiosInstance from "../Util/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/api/forget/send", { email });
      toast.success("Đã gửi email khôi phục mật khẩu. Hãy kiểm tra hộp thư!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi xảy ra!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 sm:p-8">
        <button
          onClick={() => navigate("/")}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <IoClose size={24} />
        </button>
        <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">
          Khôi phục mật khẩu
        </h2>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-md text-black mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-lg transition duration-300"
          >
            Gửi email khôi phục
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
