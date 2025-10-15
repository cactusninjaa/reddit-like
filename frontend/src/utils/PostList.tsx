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
  if (loading) {
    return (
      <div className="loading">
        <h3>Chargement des posts en cours...</h3>
        <p>Veuillez patienter pendant que nous récupérons le contenu</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <h3>⚠️ Une erreur est survenue</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="posts-container">
      {posts.length === 0 ? (
        <div className="empty-state">
          <h3>🌟 Aucun post pour le moment</h3>
          <p>Soyez le premier à partager quelque chose d'intéressant !</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))
      )}
    </div>
  );
}

export default PostList;