import { useState, useRef, useEffect } from "react";
import { Image, Video, Tag, X, ShoppingBag } from "lucide-react";
import ProductSelector from "./ProductSelector";

export default function CreatePost({ setPosts }) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Lấy userId từ session
  useEffect(() => {
    const sub = JSON.parse(sessionStorage.getItem("user"))?.sub;
    if (!sub) return;

    fetch(`http://localhost:8888/api/user/acc/${sub}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result?.id) {
          setUserId(data.result.id);
          sessionStorage.setItem("userDetail", JSON.stringify(data.result));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Chọn media
  const handleSelectMedia = (e, type) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      type,
      file,
      url: URL.createObjectURL(file),
    }));
    setMedia((prev) => [...prev, ...newMedia]);
  };

  const handleRemoveMedia = (url) => {
    setMedia((prev) => prev.filter((m) => m.url !== url));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:8888/api/upload/product", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok && data.result?.url) return data.result.url;
    throw new Error("Upload failed");
  };

  const handleSubmit = async () => {
    if (!userId) return alert("Đang tải thông tin người dùng, thử lại sau.");
    if (!content.trim() && media.length === 0) return;
    setLoading(true);

    try {
      // Upload media lên server
      const mediaUrls = await Promise.all(media.map((m) => uploadFile(m.file)));

      // Tạo post
      const res = await fetch("http://localhost:8888/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: selectedProduct?.id || "",
          content,
          mediaUrls,
        }),
      });
      const data = await res.json();

      if (res.ok && data.result) {
        const newPost = data.result;

        // Format giống Post.jsx
        const formattedPost = {
          id: newPost.id,
          userId: newPost.userId,
          name: "User " + newPost.userId.substring(0, 6),
          avatar: `https://i.pravatar.cc/150?u=${newPost.userId}`,
          content: newPost.content,
          createdAt: newPost.createAt,
          media: Array.isArray(newPost.mediaUrls)
            ? newPost.mediaUrls.map((url) => ({ type: "image", url }))
            : [],
          likes: newPost.likeCount || 0,
          comments: [],
          tags: [],
          product: selectedProduct
            ? {
                id: selectedProduct.id,
                name: selectedProduct.name,
                image: selectedProduct.imageUrl,
              }
            : null,
          status: newPost.status,
        };

        setPosts((prev) => [formattedPost, ...prev]);
        setContent("");
        setMedia([]);
        setSelectedProduct(null);
      } else {
        console.error("Failed to create post:", data);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-[#FF9090]/30">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Bạn đang nghĩ gì?"
        className="w-full p-2 border border-[#FF9090]/40 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#FF9090]"
      />

      {/* Hiển thị sản phẩm đã chọn */}
      {selectedProduct && (
        <div className="mt-3 flex items-center gap-3 bg-[#FF9090]/10 p-2 rounded-lg border border-[#FF9090]/30">
          <div className="w-12 h-12 flex-shrink-0 bg-white rounded-md overflow-hidden border border-[#FF9090]/20">
            <img
              src={selectedProduct.imageUrl || "/example-product.jpg"}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-gray-800 truncate">
              {selectedProduct.name}
            </h4>
          </div>
          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 shadow-sm transition border border-gray-100"
            title="Gỡ sản phẩm"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hiển thị media */}
      {media.length > 0 && (
        <div
          className={`mt-3 grid gap-2 ${
            media.length === 1 ? "grid-cols-1" : media.length === 2 ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          {media.map((m, idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden border border-[#FF9090]/40"
            >
              {m.type === "image" ? (
                <img src={m.url} alt={`media-${idx}`} className="w-full h-60 object-cover" />
              ) : (
                <video src={m.url} controls className="w-full h-60 object-cover" />
              )}
              <button
                onClick={() => handleRemoveMedia(m.url)}
                className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-[#FF9090] hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 border-t border-[#FF9090]/30 pt-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-1 text-[#FF9090] font-medium hover:scale-105 transition"
          >
            <Image size={20} /> Ảnh
          </button>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={(e) => handleSelectMedia(e, "image")}
            hidden
          />

          <button
            onClick={() => videoInputRef.current.click()}
            className="flex items-center gap-1 text-[#FF9090] font-medium hover:scale-105 transition"
          >
            <Video size={20} /> Video
          </button>
          <input
            type="file"
            accept="video/*"
            multiple
            ref={videoInputRef}
            onChange={(e) => handleSelectMedia(e, "video")}
            hidden
          />

          <button
            onClick={() => setShowProductModal(true)}
            className={`flex items-center gap-1 font-medium hover:scale-105 transition ${
              selectedProduct ? "text-green-600" : "text-[#FF9090]"
            }`}
          >
            <Tag size={20} /> {selectedProduct ? "Đổi sản phẩm" : "Chọn sản phẩm"}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded-md text-white ${
            loading ? "bg-gray-400" : "bg-[#FF9090] hover:bg-[#ff7b7b]"
          } transition`}
        >
          {loading ? "Đang đăng..." : "Đăng bài"}
        </button>
      </div>

      {showProductModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80 border border-[#FF9090]/40">
            <h3 className="text-lg font-semibold mb-3 text-[#FF9090]">Chọn sản phẩm</h3>
            <ProductSelector
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowProductModal(false)}
                className="bg-[#FF9090] text-white px-3 py-1 rounded-md hover:bg-[#ff7b7b] transition"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
