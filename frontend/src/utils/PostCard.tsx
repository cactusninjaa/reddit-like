// Dans frontend/src/utils/PostCard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userInfo, deleteComment, deletePost } from '../api/api';
import type { Comment, Post } from './Types';

interface PostCardProps {
  post: Post;
  onPostDeleted?: (postId: string) => void;
}

function PostCard({ post, onPostDeleted }: PostCardProps) {
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string>('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const userInfos = await userInfo(token);
          setCurrentUsername(userInfos.username);
          setCurrentUserId(userInfos._id);
          setIsAdmin(userInfos.role === 'ADMIN');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des infos utilisateur:', error);
      }
    };
    fetchCurrentUser();
  }, []);

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

  const handleDeleteComment = async (commentId: string, commentUsername: string) => {
    const isAuthor = currentUsername === commentUsername;
    const deleteMessage = isAdmin && !isAuthor
      ? `Êtes-vous sûr de vouloir supprimer ce commentaire de ${commentUsername} ? (Suppression en tant qu'administrateur)`
      : 'Êtes-vous sûr de vouloir supprimer ce commentaire ?';

    if (!window.confirm(deleteMessage)) {
      return;
    }

    try {
      const result = await deleteComment(post.userId, post._id, commentId);

      setComments(comments.filter(comment => comment._id !== commentId));

      const successMessage = result.deletedBy === 'admin'
        ? 'Commentaire supprimé avec succès (par l\'administrateur)'
        : 'Commentaire supprimé avec succès';

      alert(successMessage);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la suppression du commentaire');
    }
  };

  const handleDeletePost = async () => {
    const isAuthor = currentUserId === post.userId;
    const deleteMessage = isAdmin && !isAuthor
      ? `Êtes-vous sûr de vouloir supprimer ce post de ${post.author} ? (Suppression en tant qu'administrateur)\n\nTitre: ${post.title}`
      : `Êtes-vous sûr de vouloir supprimer ce post ?`;

    if (!window.confirm(deleteMessage)) {
      return;
    }

    try {
      const result = await deletePost(post.userId, post._id);

      const successMessage = result.deletedBy === 'admin'
        ? 'Post supprimé avec succès (par l\'administrateur)'
        : 'Post supprimé avec succès';

      alert(successMessage);

      // Notifier le parent pour mettre à jour la liste des posts
      if (onPostDeleted) {
        onPostDeleted(post._id);
      }

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la suppression du post');
    }
  };

  // Fonction pour déterminer si l'utilisateur peut supprimer un commentaire
  const canDeleteComment = (commentUsername: string) => {
    return currentUsername === commentUsername || isAdmin;
  };

  // Fonction pour déterminer si l'utilisateur peut supprimer le post
  const canDeletePost = () => {
    return currentUserId === post.userId || isAdmin;
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={post.authorAvatar}
          alt={`Avatar de ${post.author}`}
          className="avatar"
        />
        <div className="post-author-info">
          <a href="#" onClick={handleAuthorClick}>
            <span className="author">Par: {post.author}</span>
          </a>
        </div>

        {/* Bouton de suppression du post */}
        {canDeletePost() && (
          <div className="post-actions-header">
            <button
              onClick={handleDeletePost}
              className={`delete-post-btn ${isAdmin && currentUserId !== post.userId ? 'admin-delete' : ''}`}
              title={
                isAdmin && currentUserId !== post.userId
                  ? "Supprimer ce post (Admin)"
                  : "Supprimer ce post"
              }
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      <h2>{post.title}</h2>
      <p className="post-content">{post.description}</p>

      {post.picture && (
        <img src={post.picture} alt="Post" className="post-image" />
      )}

      <div className="post-actions">
        <button onClick={() => setShowComments(!showComments)}>
          {showComments ? 'Masquer les commentaires' : `Voir les commentaires (${comments.length})`}
        </button>
        <button onClick={() => setShowCommentForm(!showCommentForm)}>
          {showCommentForm ? 'Annuler' : 'Commenter'}
        </button>
      </div>

      {showCommentForm && (
        <div className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="💭 Partagez votre opinion, posez une question, ou réagissez à ce post..."
            disabled={isSubmitting}
            maxLength={500}
          />
          <div className="comment-form-actions">
            <div className="comment-counter">
              <span className={newComment.length > 400 ? 'warning' : 'normal'}>
                {newComment.length}/500
              </span>
            </div>
            <button
              onClick={handleAddComment}
              disabled={isSubmitting || !newComment.trim()}
              type="button"
            >
              {isSubmitting ? (
                <>
                  <span className="loading-spinner"></span>
                  Publication...
                </>
              ) : (
                'Publier'
              )}
            </button>
          </div>
        </div>
      )}

      {showComments && (
        <div className="comments-section">
          <h4>Commentaires ({comments.length})</h4>
          {comments.length === 0 ? (
            <p className="no-comments">Aucun commentaire pour le moment. Soyez le premier à commenter !</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-content">
                  <p><strong>{comment.username}:</strong> {comment.content}</p>
                </div>
                {canDeleteComment(comment.username) && (
                  <div className="comment-actions">
                    <button
                      onClick={() => handleDeleteComment(comment._id, comment.username)}
                      className={`delete-comment-btn ${isAdmin && currentUsername !== comment.username ? 'admin-delete' : ''}`}
                      title={
                        isAdmin && currentUsername !== comment.username
                          ? "Supprimer ce commentaire (Admin)"
                          : "Supprimer ce commentaire"
                      }
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default PostCard;