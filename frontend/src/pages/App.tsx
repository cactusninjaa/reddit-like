import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import '../App.css';

import Header from '../utils/Header';
import CreatePostForm from '../utils/CreatePostForm';
import PostList from '../utils/PostList';
import { StatsCard } from '../utils/StatsCard';
import type { Post, NewPost } from '../utils/Types';
import { getUsers, userInfo, logoutUser } from '../api/api';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId] = useState<string>('');
  const [userConnected, setUserConnected] = useState<any>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // 🧹 Gestion de la déconnexion
  const handleLogout = async () => {
    try {
      if (token) await logoutUser(token);
    } catch (err) {
      console.warn("Erreur pendant la déconnexion :", err);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("expiresAt");
      navigate("/login");
    }
  };

  // 🧍‍♂️ Charger les infos de l'utilisateur connecté
  const fetchUserInfo = async () => {
    if (!token) return;
    try {
      const result = await userInfo(token);
      setUserConnected(result);
    } catch (error) {
      console.error("Token invalide ou expiré :", error);
      handleLogout(); // auto-déconnexion si token invalide
    }
  };

  // 👥 Récupérer les utilisateurs
  const fetchUsers = async () => {
    try {
      const users = await getUsers();
      setUsers(users);
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs :", error);
    }
  };

  // 📝 Récupérer tous les posts
  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://reddit-like-backend.vercel.app/api/posts');
      if (!response.ok) throw new Error('Erreur lors de la récupération des posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // 👤 Récupérer les posts d'un utilisateur spécifique
  const fetchUserPosts = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://reddit-like-backend.vercel.app/api/users/${userId}/posts`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des posts utilisateur");
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Chargement initial
  useEffect(() => {
    if (!token) return; // redirection gérée plus bas

    fetchUserInfo();
    fetchUsers();

    if (selectedUserId) fetchUserPosts(selectedUserId);
    else fetchAllPosts();
  }, [selectedUserId, token]);

  // 🔒 Si pas de token => redirection
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ➕ Création d’un post
  const handleCreatePost = async (newPost: NewPost) => {
    try {
      setCreating(true);
      const response = await fetch(`https://reddit-like-backend.vercel.app/api/users/${userConnected._id}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newPost.title,
          description: newPost.description,
          picture: newPost.picture || undefined,
        }),
      });

      if (!response.ok) throw new Error('Erreur lors de la création du post');

      // Rafraîchir les posts
      if (selectedUserId) fetchUserPosts(selectedUserId);
      else fetchAllPosts();

      setShowCreateForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  // 🧭 Toggle du formulaire
  const handleToggleCreateForm = () => setShowCreateForm(!showCreateForm);

  // 🧩 Rendu
  return (
    <div className="app">
      <div className="container">
        {userConnected.role === "ADMIN" && (
          <StatsCard users={users} posts={posts} />
        )}

        <Header
          onCreatePost={handleToggleCreateForm}
          showCreateForm={showCreateForm}
          token={token}
          onLogout={handleLogout} // 👈 on passe la déconnexion ici
        />

        {showCreateForm && (
          <CreatePostForm
            onSubmit={handleCreatePost}
            onCancel={() => setShowCreateForm(false)}
            isCreating={creating}
          />
        )}

        <PostList posts={posts} loading={loading} error={error} />
      </div>
    </div>
  );
}

export default App;
