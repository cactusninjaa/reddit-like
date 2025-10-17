// Dans frontend/src/utils/PostCard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userInfo, deleteComment } from '../api/api';
import type { Comment, Post } from './Types';

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string>('');

  useState(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userInfos = await userInfo(token);
          setCurrentUsername(userInfos.username);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des infos utilisateur:', error);
      }
    };
    fetchCurrentUser();
  });

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/profile/${post.userId}`);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('Veuillez écrire un commentaire');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Vous devez être connecté pour commenter');
      return;
    }

    setIsSubmitting(true);

    try {
      const userInfos = await userInfo(token);
      const username = userInfos.username;

      const response = await fetch(`https://reddit-like-backend.vercel.app/api/users/${post.userId}/posts/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment.trim(), username: username })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du commentaire');
      }

      const addedComment = await response.json();
      setComments([...comments, addedComment]);
      setNewComment('');
      setShowCommentForm(false);

    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      await deleteComment(post.userId, post._id, commentId);
      
      setComments(comments.filter(comment => comment._id !== commentId));
      
      alert('Commentaire supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la suppression du commentaire');
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={post.authorAvatar}
          alt={`Avatar de ${post.author}`}
          className="avatar"
        />
        <a href="#" onClick={handleAuthorClick}>
          <span className="author">Par: {post.author}</span>
        </a>
      </div>

      <h2>{post.title}</h2>
      <p className="post-content">{post.description}</p>

      {post.picture && (
        <img src={post.picture} alt="Post" className="post-image" />
      )}

      <div className="post-actions">
        <button onClick={() => setShowCommentForm(!showCommentForm)}>
          {showCommentForm ? 'Annuler' : 'Commenter'}
        </button>
      </div>

      {showCommentForm && (
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Écrivez votre commentaire..."
            disabled={isSubmitting}
          />
          <button
            onClick={handleAddComment}
            disabled={isSubmitting || !newComment.trim()}
          >
            {isSubmitting ? 'Envoi...' : 'Publier'}
          </button>
        </div>
      )}

      <div className="comments-section">
        <h4>Commentaires ({comments.length})</h4>
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <div className="comment-content">
              <p><strong>{comment.username}:</strong> {comment.content}</p>
            </div>
            {currentUsername === comment.username && (
              <div className="comment-actions">
                <button 
                  onClick={() => handleDeleteComment(comment._id)}
                  className="delete-comment-btn"
                  title="Supprimer ce commentaire"
                >
                  🗑️ Supprimer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostCard;