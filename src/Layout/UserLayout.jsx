import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";

export default function UserLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}