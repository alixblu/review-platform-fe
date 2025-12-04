import CreatePost from "../Component/CreatePost";
import Post from "../Component/Post";

export default function Feed({ posts, setPosts }) {
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-6">
      <CreatePost setPosts={setPosts} />
      {sortedPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
