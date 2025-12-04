import { Outlet } from "react-router-dom";
// import Header from "./Header";

function AccountLayout() {
  return (
      <div className="bg-gray-100 min-h-screen">
          <Outlet />
      </div>
  );
}

export default AccountLayout;
