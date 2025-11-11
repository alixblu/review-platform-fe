// src/pages/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../Util/axios";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSessionUser = async () => {
      try {
        const { data } = await axios.get("/api/auth/me", { withCredentials: true });
        if (data) {
          sessionStorage.setItem("user", JSON.stringify(data));
        }
        navigate("/");
      } catch {
        navigate("/login");
      }
    };
    fetchSessionUser();
  }, [location, navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
};

export default AuthCallback;
