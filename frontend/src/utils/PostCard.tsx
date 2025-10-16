import { useNavigate } from 'react-router-dom';
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

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/profile/${post.userId}`);
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

      <div className="comments-section">
        <h4>Commentaires ({post.comments.length})</h4>
        {post.comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostCard;