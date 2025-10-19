import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function UserLayout() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}