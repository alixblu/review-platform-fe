import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", gender: "", profilePic: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const sessionUser = JSON.parse(sessionStorage.getItem("userDetail"));

  useEffect(() => {
    if (!sessionUser) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8888/api/user/${sessionUser.id}`);
        const data = await res.json();
        setUser(data.result || sessionUser);
      } catch (err) {
        console.error("Lỗi khi lấy user:", err);
        setUser(sessionUser);
      }
    };
    fetchUser();
  }, []);

  const InfoItem = ({ label, value }) => (
    <div className="border-b border-gray-200 pb-2">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-lg font-medium text-gray-800 break-words">
        {value !== null && value !== undefined ? value : "Chưa cập nhật"}
      </p>
    </div>
  );

  if (!user) return <div className="p-6 text-center">Loading...</div>;

  const avatarSrc = user.profilePic || "https://via.placeholder.com/150?text=No+Image";

  const openModal = () => {
    setForm({
      name: user.name || "",
      age: user.age || "",
      gender: user.gender || "FEMALE",
      profilePic: user.profilePic || "",
    });
    setModalOpen(true);
  };

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  // Upload file lên API sản phẩm
  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8888/api/upload/product", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload thất bại");
      const data = await res.json();

      if (data.code === 1000 && data.result?.url) {
        setForm((prev) => ({ ...prev, profilePic: data.result.url }));
        alert("Upload ảnh thành công!");
      } else {
        throw new Error("Upload thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8888/api/user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Update thất bại");
      const data = await res.json();
      setUser(data.result || { ...user, ...form });
      alert("Cập nhật thành công!");
      setModalOpen(false);
      sessionStorage.setItem("userDetail", JSON.stringify(data.result || { ...user, ...form }));
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header & Cover */}
        <div className="bg-pink-100 h-32 relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white/80 hover:bg-white text-gray-700 px-3 py-1 rounded shadow text-sm transition"
          >
            &larr; Trở về
          </button>
        </div>

        {/* Avatar & Main Name */}
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <img
              src={avatarSrc}
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white"
            />
            <button
              onClick={openModal}
              className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow transition"
            >
              Edit Profile
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-800 break-all">{user.name}</h1>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem label="Tên hiển thị" value={user.name} />
            <InfoItem label="Tuổi" value={user.age} />
            <InfoItem
              label="Giới tính"
              value={user.gender === "FEMALE" ? "Nữ" : user.gender === "MALE" ? "Nam" : user.gender}
            />
          </div>
        </div>
      </div>

      {/* Modal Edit Profile */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-pink-500"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <div className="space-y-4">
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Tên hiển thị"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                value={form.age}
                onChange={(e) => handleChange("age", Number(e.target.value))}
                placeholder="Tuổi"
                className="w-full p-2 border rounded"
              />
              <select
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="FEMALE">Nữ</option>
                <option value="MALE">Nam</option>
                <option value="OTHER">Khác</option>
              </select>

              {/* Upload Avatar */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="flex-1 p-2 border rounded"
                  disabled={uploading}
                />
                {uploading && <span className="text-sm text-gray-500">Đang upload...</span>}
              </div>

              <button
                onClick={handleUpdate}
                disabled={loading || uploading}
                className={`w-full py-2 rounded-md text-white ${
                  loading || uploading ? "bg-gray-400" : "bg-pink-500 hover:bg-pink-600"
                }`}
              >
                {loading ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
