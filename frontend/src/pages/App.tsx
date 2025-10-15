import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom';

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

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const token = localStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Récupérer tous les posts
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://reddit-like-backend.vercel.app/api/posts');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les posts d'un utilisateur spécifique
  const fetchUserPosts = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://reddit-like-backend.vercel.app/api/users/${userId}/posts`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des posts de l\'utilisateur');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchUserPosts(selectedUserId);
    } else {
      fetchAllPosts();
    }
  }, [selectedUserId]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  return (
    <>
      <h1>Reddit-like Posts</h1>

      <div className="filter-section">
        <input
          type="text"
          placeholder="ID utilisateur (optionnel)"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        />
        <button onClick={() => setSelectedUserId('')}>
          Voir tous les posts
        </button>
      </div>

      <div className="posts-container">
        {posts.length === 0 ? (
          <p>Aucun post disponible</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-header">
                <img
                  src={post.authorAvatar}
                  alt={`Avatar de ${post.author}`}
                  className="avatar"
                />
                <span className="author">Par: {post.author}</span>
              </div>

              <h2>{post.title}</h2>
              <p className="post-content">{post.description}</p>

              {post.picture && (
                <img src={post.picture} alt="Post" className="post-image" />
              )}

              <div className="comments-section">
                <h4>Commentaires ({post.comments.length})</h4>
                {post.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <p>{comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}

export default App