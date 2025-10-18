import { Outlet } from "react-router-dom";
const UserLayout = () => {
  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default UserLayout;