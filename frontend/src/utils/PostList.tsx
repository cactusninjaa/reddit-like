import PostCard from './PostCard';

interface Comment {
  _id: string;
  content: string;
}

interface Post {
  _id: string;
  title: string;
  description: string;
  picture?: string;
  comments: Comment[];
  author: string;
  authorAvatar: string;
  userId: string;
}

interface PostListProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

function PostList({ posts, loading, error }: PostListProps) {
  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="posts-container">
      {posts.length === 0 ? (
        <p className="no-posts">Aucun post disponible</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))
      )}
    </div>
  );
}

export default PostList;