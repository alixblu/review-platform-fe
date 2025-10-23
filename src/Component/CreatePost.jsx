import { useState, useRef } from "react";
import { Image, Video, Tag, X } from "lucide-react";
import TagSelector from "./TagSelector";

export default function CreatePost({ setPosts }) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]); // cho phép nhiều ảnh/video
  const [tags, setTags] = useState([]);
  const [showTagModal, setShowTagModal] = useState(false);

  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Upload nhiều ảnh
  const handleSelectImage = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      type: "image",
      url: URL.createObjectURL(file),
    }));
    setMedia((prev) => [...prev, ...newMedia]);
  };

  // Upload nhiều video
  const handleSelectVideo = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map((file) => ({
      type: "video",
      url: URL.createObjectURL(file),
    }));
    setMedia((prev) => [...prev, ...newMedia]);
  };

  // Xóa file media
  const handleRemoveMedia = (url) => {
    setMedia((prev) => prev.filter((m) => m.url !== url));
  };

  // Đăng bài
  const handleSubmit = () => {
    if (!content.trim() && media.length === 0) return;

    const newPost = {
      id: Date.now(),
      name: "Ngô Trí Anh",
      avatar: "https://i.pravatar.cc/150?img=10",
      content,
      media,
      likes: 0,
      tags,
      comments: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    setContent("");
    setMedia([]);
    setTags([]);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md border border-[#FF9090]/30">
      {/* Nội dung bài viết */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Bạn đang nghĩ gì?"
        className="w-full p-2 border border-[#FF9090]/40 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#FF9090]"
      />

      {/* Preview ảnh/video */}
      {media.length > 0 && (
        <div
          className={`mt-3 grid gap-2 ${
            media.length === 1
              ? "grid-cols-1"
              : media.length === 2
              ? "grid-cols-2"
              : "grid-cols-3"
          }`}
        >
          {media.map((m, idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden border border-[#FF9090]/40"
            >
              {m.type === "image" ? (
                <img
                  src={m.url}
                  alt={`media-${idx}`}
                  className="w-full h-60 object-cover"
                />
              ) : (
                <video
                  src={m.url}
                  controls
                  className="w-full h-60 object-cover"
                />
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

      {/* Các nút icon hành động */}
      <div className="flex items-center justify-between mt-3 border-t border-[#FF9090]/30 pt-3">
        <div className="flex items-center gap-4">
          {/* Ảnh */}
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
            onChange={handleSelectImage}
            hidden
          />

          {/* Video */}
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
            onChange={handleSelectVideo}
            hidden
          />

          {/* Gắn thẻ */}
          <button
            onClick={() => setShowTagModal(true)}
            className="flex items-center gap-1 text-[#FF9090] font-medium hover:scale-105 transition"
          >
            <Tag size={20} /> Gắn thẻ
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-[#FF9090] text-white px-4 py-2 rounded-md hover:bg-[#ff7b7b] transition"
        >
          Đăng bài
        </button>
      </div>

      {/* Modal chọn tag */}
      {showTagModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80 border border-[#FF9090]/40">
            <h3 className="text-lg font-semibold mb-3 text-[#FF9090]">
              Gắn thẻ sản phẩm
            </h3>
            <TagSelector selectedTags={tags} setSelectedTags={setTags} />
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowTagModal(false)}
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
