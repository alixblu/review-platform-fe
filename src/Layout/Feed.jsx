import CreatePost from "../Component/CreatePost";
import Post from "../Component/Post";

export default function Feed({ posts, setPosts }) {
  return (
    <div className="space-y-6">
      <CreatePost setPosts={setPosts} />
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
