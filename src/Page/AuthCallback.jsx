// src/pages/AuthCallback.jsx
import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../Util/axios";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasExchanged = useRef(false);

  useEffect(() => {
    const fetchSessionUser = async () => {
      // Prevent double execution in React StrictMode
      if (hasExchanged.current) {
        return;
      }
      hasExchanged.current = true;
      try {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");
        if (!code) {
          navigate("/login");
          return;
        }

        const appUrl = import.meta.env.VITE_APP_URL || "http://localhost:3000";
        const redirectUri = `${appUrl}/auth/callback`;
        const { data } = await axios.post(
          "/api/auth/exchange",
          { code, redirectUri },
          { withCredentials: true }
        );

        console.log("Authenticated user:", data);

        // The response is wrapped in ApiResponse: { code, message, result }
        const authData = data.result || data;

        if (authData) {
          // Store token and user info
          if (authData.accessToken) {
            sessionStorage.setItem("token", authData.accessToken);
          }
          const userInfo = authData.user || authData.account;
          if (userInfo) {
            sessionStorage.setItem("user", JSON.stringify(userInfo));
          }          
          sessionStorage.setItem("authData", JSON.stringify(authData));

          console.log("✅ Login successful, redirecting to /user/home");
          navigate("/user/home");
        } else {
          throw new Error("No auth data received");
        }
      } catch (error) {
        console.error("Login error:", error);
        console.error("Error details:", error.response?.data);

        // Show user-friendly error message
        const errorMessage =
          error.response?.data?.message || error.message || "Login failed";
        alert(`Login failed: ${errorMessage}\n\nPlease try logging in again.`);

        navigate("/login");
      }
    };
    fetchSessionUser();
  }, [location, navigate]);

  return <p>Đang xử lý đăng nhập...</p>;
};

export default AuthCallback;
