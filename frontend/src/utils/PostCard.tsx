import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userInfo } from '../api/api';

interface Comment {
  _id: string;
  content: string;
  username: string;
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

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            <p>{comment.content}</p>
            <p>{comment.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostCard;