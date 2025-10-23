import { useState } from "react";
import Feed from "../Layout/Feed";

export default function FeedPage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "Ngô Trí Anh",
      avatar: "https://i.pravatar.cc/150?img=32",
      content: "Hôm nay trời thật đẹp ☀️",
      createdAt: "2025-10-17T09:30:00",
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
        { type: "image", url: "https://picsum.photos/600/400?random=101" },
        { type: "image", url: "https://picsum.photos/600/400?random=102" },
      ],
      likes: 5,
      tags: ["Áo Hoodie", "Giày Nike"],
      comments: [
        { id: 1, text: "Đẹp quá!" },
        { id: 2, text: "Tôi cũng muốn đi chơi nè ☀️" },
      ],
    },
    {
      id: 2,
      name: "Hoàng Phúc",
      avatar: "/src/assets/user-avatar.jpg",
      content:
        "Cà phê sáng cùng team ☕\nMột buổi sáng chill chill tại quán quen ❤️",
      createdAt: "2025-10-17T07:45:00",
      media: [
        { type: "image", url: "https://picsum.photos/600/400?random=2" },
        { type: "image", url: "https://picsum.photos/600/400?random=21" },
      ],
      likes: 78,
      comments: [{ id: 1, text: "Nhìn tách cà phê là thấy tỉnh rồi!" }],
      tags: ["teamwork", "morning"],
    },
    {
      id: 3,
      name: "Lan Anh Beauty",
      avatar: "/src/assets/user-avatar.jpg",
      content: "Da căng bóng sau 7 ngày dùng serum mới 💧💖",
      createdAt: "2025-10-16T20:10:00",
      media: [
        { type: "image", url: "https://picsum.photos/600/400?random=10" },
      ],
      likes: 132,
      comments: [{ id: 1, text: "Trông xịn thật đó!" }],
      tags: ["skincare", "beauty"],
      product: {
        name: "Serum Dưỡng Ẩm Collagen GlowUp",
        price: "499.000₫",
        image: "https://picsum.photos/400/300?random=15",
        description:
          "Serum giúp cấp ẩm sâu, cải thiện độ đàn hồi và mang lại làn da căng bóng chỉ sau 7 ngày sử dụng.",
      },
    },
    {
      id: 4,
      name: "Phạm Quốc Bảo",
      avatar: "/src/assets/user-avatar.jpg",
      content:
        "Tối nay mình thử nấu món **mì Ý sốt kem nấm** 🍝\nAi thử qua chưa?",
      createdAt: "2025-10-16T18:22:00",
      media: [
        { type: "image", url: "https://picsum.photos/600/400?random=4" },
        { type: "image", url: "https://picsum.photos/600/400?random=5" },
        { type: "image", url: "https://picsum.photos/600/400?random=6" },
        { type: "image", url: "https://picsum.photos/600/400?random=7" },
      ],
      likes: 42,
      comments: [],
      tags: ["food", "homecook"],
    },
    {
      id: 5,
      name: "Minh Nhật",
      avatar: "/src/assets/user-avatar.jpg",
      content: "Clip nhỏ quay lại chuyến đi Đà Lạt 🎥\nKhông khí thật tuyệt!",
      createdAt: "2025-10-15T22:40:00",
      media: [
        { type: "video", url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4" },
        { type: "image", url: "https://picsum.photos/600/400?random=8" },
        { type: "image", url: "https://picsum.photos/600/400?random=9" },
      ],
      likes: 134,
      comments: [
        { id: 1, text: "Đẹp quá! Muốn đi lại ghê 😍" },
        { id: 2, text: "Video chill thật đó!" },
      ],
      tags: ["travel", "dalat", "memories"],
    },
  ]);

  return (
    <div className="flex justify-center px-4 mt-6">
      <div className="w-full md:w-2/3 lg:w-1/2">
        <Feed posts={posts} setPosts={setPosts} />
      </div>
    </div>
  );
}
