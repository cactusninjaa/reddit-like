import { useState, useEffect } from 'react'
import './App.css'

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
  const [selectedUserId] = useState<string>('');

  // États pour le formulaire de création de post
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    picture: '',
    userId: ''
  });
  const [creating, setCreating] = useState(false)

  const createPost = async () => {
    if ( !newPost.title || !newPost.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setCreating(true);
      // const response = await fetch(`https://reddit-like-backend.vercel.app/api/users/${newPost.userId}/posts`, {
     
      const response = await fetch(`https://reddit-like-backend.vercel.app/api/users/68ef6c0cf6cb6205e18c8dd1/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPost.title,
          description: newPost.description,
          picture: newPost.picture || undefined
        })
      });


      if (!response.ok) {
        throw new Error('Erreur lors de la création du post');
      }


      // Rafraîchir la liste des posts
      if (selectedUserId) {
        fetchUserPosts(selectedUserId);
      } else {
        fetchAllPosts();
      }

      // Réinitialiser le formulaire
      setNewPost({
        title: '',
        description: '',
        picture: '',
        userId: ''
      });
      setShowCreateForm(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };
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
        <button
          className="create-post-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Annuler' : 'Créer un post'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-post-form">
          <h3>Créer un nouveau post</h3>
          
          <div className="form-group">
            <label>Titre *</label>
            <input
              type="text"
              placeholder="Titre du post"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              placeholder="Description du post"
              value={newPost.description}
              onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className="form-group">
            <label>URL de l'image (optionnel)</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={newPost.picture}
              onChange={(e) => setNewPost({ ...newPost, picture: e.target.value })}
            />
          </div>
          <div className="form-buttons">
            <button
              onClick={createPost}
              disabled={creating}
              className="submit-btn"
            >
              {creating ? 'Création...' : 'Créer le post'}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="cancel-btn"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
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