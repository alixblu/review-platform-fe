import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Giả lập việc lấy dữ liệu từ API (hoặc bạn có thể truyền qua props)
  useEffect(() => {
    // Đây là object JSON bạn cung cấp
    const apiResponse = {
        "id": "47df7ef7-3b01-4126-af89-afbc29faf5fa",
        "accId": "b418a458-2031-700a-7c5b-8ecf6ddcf29d",
        "name": "google_102657138856070861852",
        "age": 16,
        "gender": "FEMALE",
        "profilePic": null
    };
    setUser(apiResponse);
  }, []);

  // Component con hiển thị từng dòng
  const InfoItem = ({ label, value }) => (
    <div className="border-b border-gray-200 pb-2">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-medium text-gray-800 break-words">
        {value !== null && value !== undefined ? value : "Chưa cập nhật"}
      </p>
    </div>
  );

  // Loading state nếu chưa có dữ liệu
  if (!user) return <div className="p-6 text-center">Loading...</div>;

  // Logic xử lý ảnh đại diện: Nếu profilePic là null thì dùng ảnh mặc định
  const avatarSrc = user.profilePic || "https://via.placeholder.com/150?text=No+Image";

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* --- Header & Cover --- */}
        <div className="bg-pink-100 h-32 relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 bg-white/80 hover:bg-white text-gray-700 px-3 py-1 rounded shadow text-sm transition"
            >
              &larr; Trở về
            </button>
        </div>

        {/* --- Avatar & Main Name --- */}
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
             <img
                src={avatarSrc}
                alt="avatar"
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
              />
              <button 
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow transition"
              >
                Edit Profile
              </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 break-all">{user.name}</h1>
            {/* Vì JSON không có email, tạm thời hiển thị ID hoặc ẩn đi */}
            <p className="text-gray-400 text-xs mt-1">ID: {user.id}</p>
          </div>

          {/* --- Detailed Info Grid --- */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem label="Tên hiển thị" value={user.name} />
            <InfoItem label="Tuổi" value={user.age} />
            
            {/* Xử lý hiển thị Gender cho đẹp hơn (Optional) */}
            <InfoItem 
                label="Giới tính" 
                value={user.gender === "FEMALE" ? "Nữ" : (user.gender === "MALE" ? "Nam" : user.gender)} 
            />
            
            <InfoItem label="Account ID" value={user.accId} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;