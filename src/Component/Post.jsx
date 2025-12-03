import { useState, useRef, useEffect } from "react";
import { Heart, MessageCircle, X, Tag } from "lucide-react";
import axios from "axios";

export default function Post({ post }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [comments, setComments] = useState(post.comments || []);
  const [liked, setLiked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const commentInputRef = useRef(null);

  useEffect(() => {
    if (showModal && commentInputRef.current) {
      commentInputRef.current.focus();
    }
  }, [showModal]);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = { id: Date.now(), text: commentText };
    setComments((prev) => [...prev, newComment]);
    setCommentText("");
  };

  const handleLike = async (postId, setLiked, setLikes) => {
    // Lấy userId từ sessionStorage
    const USER_ID = JSON.parse(sessionStorage.getItem("userDetail"))?.accId;
    if (!USER_ID)
      return alert("Vui lòng đăng nhập để thực hiện hành động này.");

    try {
      // Gọi API toggle-like
      const res = await axios.post(
        `http://localhost:8888/api/posts/${postId}/toggle-like`,
        { userId: USER_ID },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = res.data.result;
      if (data) {
        // Cập nhật trạng thái liked và số lượt like theo response
        setLiked(data.liked);
        setLikes(data.newLikeCount);
      }
    } catch (err) {
      console.error("Like/unlike thất bại:", err);
      alert("Không thể thực hiện thao tác, thử lại sau");
    }
  };
  // --- BỐ CỤC MEDIA ---
  const renderMedia = () => {
    if (!post.media || post.media.length === 0) return null;

    const count = post.media.length;
    const items = post.media.slice(0, 4);

    if (count === 1) {
      const item = items[0];
      return (
        <div className="mb-3">
          {item.type === "image" ? (
            <img
              src={item.url}
              className="w-full rounded-lg object-cover max-h-[500px]"
              alt="media-1"
            />
          ) : (
            <video
              src={item.url}
              controls
              className="w-full rounded-lg max-h-[500px]"
            />
          )}
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-2 mb-3">
          {items.map((item, idx) => (
            <MediaItem key={idx} item={item} />
          ))}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="col-span-2">
            <MediaItem item={items[0]} tall />
          </div>
          <div className="flex flex-col gap-2">
            <MediaItem item={items[1]} small />
            <MediaItem item={items[2]} small />
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2 mb-3">
        {items.map((item, idx) => (
          <div key={idx} className="relative">
            <MediaItem item={item} />
            {idx === 3 && count > 4 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-3xl font-semibold">
                +{count - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // --- COMPONENT MEDIA ITEM ---
  const MediaItem = ({ item, tall, small }) => {
    const base = "w-full rounded-lg object-cover";
    const height = tall ? "h-[400px]" : small ? "h-[200px]" : "h-[300px]";
    return item.type === "image" ? (
      <img src={item.url} alt="media" className={`${base} ${height}`} />
    ) : (
      <video src={item.url} controls className={`${base} ${height}`} />
    );
  };

  return (
    <>
      {/* --- BÀI VIẾT --- */}
      <div className="bg-white p-4 rounded-xl shadow-md border border-[#FF9090]/30 mb-4 transition hover:shadow-lg">
        {/* Header người đăng */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src={post.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full border border-[#FF9090]/40"
          />
          <div>
            <h3 className="font-semibold text-[#FF9090]">{post.name}</h3>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Link sản phẩm đã gắn thẻ */}
        {post.product && (
          <div className="mb-2">
            <a
              href={`/product/${post.product.id}`}
              className="text-[#FF9090] font-medium hover:underline"
            >
              {post.product.name}
            </a>
          </div>
        )}

        {/* Nội dung */}
        <p className="text-gray-800 mb-3 whitespace-pre-line">{post.content}</p>

        {/* Media */}
        {renderMedia()}

        {/* Tag thường */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-sm bg-[#FF9090]/10 text-[#FF9090] px-2 py-1 rounded-full border border-[#FF9090]/20"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* --- Nút hành động --- */}
        <div className="flex justify-between items-center border-t border-[#FF9090]/20 pt-3 mt-2">
          {/* Like */}
          <button
            onClick={() => handleLike(post.id, setLiked, setLikes)}
            className={`flex-1 flex justify-center items-center gap-1 transition transform hover:scale-105 ${
              liked ? "text-[#FF9090]" : "text-gray-600 hover:text-[#FF9090]"
            }`}
          >
            <Heart
              size={22}
              fill={liked ? "#FF9090" : "none"}
              strokeWidth={2}
              className={`transition-transform duration-300 ${
                liked ? "scale-125" : "scale-100"
              }`}
            />
            <span className="text-sm">{likes}</span>
          </button>

          {/* Comment */}
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 flex justify-center items-center gap-1 text-gray-600 hover:text-[#FF9090] transition transform hover:scale-105"
          >
            <MessageCircle size={22} />
            <span className="text-sm">{comments.length}</span>
          </button>
        </div>
      </div>

      {/* --- POPUP BÌNH LUẬN --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-6xl h-[85vh] rounded-xl shadow-2xl flex overflow-hidden relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-[#FF9090] z-50"
            >
              <X size={30} />
            </button>

            {/* BÊN TRÁI: Media */}
            <div className="w-[65%] bg-black flex items-center justify-center">
              {post.media?.length ? (
                <img
                  src={post.media[0].url}
                  alt="post"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <p className="text-white text-center">Không có hình ảnh</p>
              )}
            </div>

            {/* BÊN PHẢI: Nội dung + bình luận */}
            <div className="w-[35%] flex flex-col bg-white">
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <p className="text-gray-800 mb-3">{post.content}</p>

                {/* Tag */}
                {post.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-sm bg-[#FF9090]/10 text-[#FF9090] px-2 py-1 rounded-full border border-[#FF9090]/20"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Danh sách bình luận */}
                <div className="border-t border-[#FF9090]/20 mt-3 pt-3">
                  {comments.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      Chưa có bình luận nào.
                    </p>
                  ) : (
                    comments.map((c) => (
                      <div
                        key={c.id}
                        className="p-2 bg-[#FF9090]/5 rounded-md border border-[#FF9090]/10 mb-2"
                      >
                        <p className="text-gray-800 text-sm">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Ô nhập bình luận */}
              <div className="border-t border-[#FF9090]/30 flex items-center p-3 bg-white">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="flex-1 p-2 border border-[#FF9090]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF9090]"
                />
                <button
                  onClick={handleAddComment}
                  className="ml-2 bg-[#FF9090] text-white px-3 py-1 rounded-md hover:bg-[#ff7b7b] transition"
                >
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
