import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostCard from '../../../utils/PostCard';
import { userInfo } from '../../../api/api';
import '../../../App.css';

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

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    createdAt: string;
}

function ProfilePage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<unknown>(null);

    
    useEffect(() => {
        const fetchUserData = async () => {
            const tokenFromStorage = localStorage.getItem('authToken');
            const user = await userInfo(tokenFromStorage)
            setUser(user)
            if (!slug) return;

            try {
                setLoading(true);
                setError(null);

                // Récupérer le profil utilisateur
                const profileResponse = await fetch(`https://reddit-like-backend.vercel.app/api/users/${slug}/posts`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!profileResponse.ok) {
                    throw new Error('Utilisateur non trouvé');
                }

                const profileData = await profileResponse.json();
                setUserProfile(profileData);

                // Récupérer les posts de l'utilisateur
                const postsResponse = await fetch(`https://reddit-like-backend.vercel.app/api/users/${slug}/posts`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!postsResponse.ok) {
                    throw new Error('Erreur lors du chargement des posts');
                }

                const postsData = await postsResponse.json();
                setUserPosts(postsData);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [slug]);

    if (loading) {
        return (
            <div className="profile-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Chargement du profil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-page">
                <div className="error-container">
                    <h2>❌ Erreur</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="profile-page">
                <div className="error-container">
                    <h2>👤 Utilisateur non trouvé</h2>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <button onClick={() => navigate('/')} className="back-button">
                    ← Retour
                </button>

                <div className="profile-info">
                    <img
                        src={userProfile.avatar}
                        alt={`Avatar de ${user.username}`}
                        className="profile-avatar"
                    />
                    <div className="profile-details">
                        <h1>👤 {user.username}</h1>
                        <p className="profile-email">📧 {user.email}</p>
                        <div className="profile-stats">
                            <span className="stat">📝 {userPosts.length} post{userPosts.length > 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-content">
                <h2>📋 Posts de {user.username}</h2>

                {userPosts.length === 0 ? (
                    <div className="no-posts">
                        <p>😔 Cet utilisateur n'a encore publié aucun post.</p>
                    </div>
                ) : (
                    <div className="posts-list">
                        {userPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;