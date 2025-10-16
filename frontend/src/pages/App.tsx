import { useState, useEffect } from 'react';
import '../App.css';
import Header from '../utils/Header';
import CreatePostForm from '../utils/CreatePostForm';
import PostList from '../utils/PostList';
import type { Post, NewPost } from '../utils/Types';
import { Navigate } from 'react-router-dom';
import { getUsers, userInfo } from '../api/api';
import { StatsCard } from '../utils/StatsCard';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId] = useState<string>('');
  const [userConnected, setUserConnected] = useState<any>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchUsers = async () => {
      const users = await getUsers()
      setUsers(users)
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

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const result = await userInfo(token);
        setUserConnected(result);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    fetchUserInfo();
    fetchUsers()
    if (selectedUserId) {
      fetchUserPosts(selectedUserId);
    } else {
      fetchAllPosts();
    }
  }, [selectedUserId, token]);

  if (!token) {
    return <Navigate to="/login" />;
  }
 
  // Récupérer les posts d'un utilisateur spécifique    d
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


  // Créer un nouveau post
  const handleCreatePost = async (newPost: NewPost) => {
    try {
      setCreating(true);
      const response = await fetch(`https://reddit-like-backend.vercel.app/api/users/${userConnected._id}/posts`, {
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

      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  // Toggle du formulaire de création
  const handleToggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  // console.log(userConnected.firstName)

  return (
    <div className="app">
      <div className="container">
        {userConnected.role === "ADMIN" &&
           <StatsCard
            users={users}
            posts={posts}
          />
        }

        <Header
          onCreatePost={handleToggleCreateForm}
          showCreateForm={showCreateForm}
        />

        {showCreateForm && (
          <CreatePostForm
            onSubmit={handleCreatePost}
            onCancel={() => setShowCreateForm(false)}
            isCreating={creating}
          />
        )}

        <PostList
          posts={posts}
          loading={loading}
          error={error}
        />

      </div>
    </div>
  );
}

export default App;