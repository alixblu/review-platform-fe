import { useEffect, useState } from "react";
import Feed from "../Layout/Feed";

export default function FeedPage() {
const [posts, setPosts] = useState([]);

useEffect(() => {
fetch(`http://localhost:8888/api/posts?size=9999`)
.then((res) => res.json())
.then((data) => {
if (data?.result?.content) {
const list = data.result.content.map((p) => ({
id: p.id,
name: "User " + p.userId.substring(0, 6),
avatar: `https://i.pravatar.cc/150?u=${p.userId}`,
content: p.content,
createdAt: new Date(p.createAt).toLocaleString(),
media: Array.isArray(p.mediaUrls)
? p.mediaUrls.map((url) => ({ type: "image", url }))
: [],
likes: p.likeCount || 0,
comments: [], // nếu API có comment thì map thêm
tags: [], // placeholder
status: p.status,
}));


      setPosts(list);
    }
  })
  .catch((err) => console.error("Error fetching posts:", err));


}, []);

return ( <div className="flex justify-center px-4 mt-6"> <div className="w-full md:w-2/3 lg:w-1/2"> <Feed posts={posts} setPosts={setPosts} /> </div> </div>
);
}
