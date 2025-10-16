import '../App.css';

type StatsCardProps = {
  users: any[];
  posts: any[];
};

export const StatsCard = ({ users, posts }: StatsCardProps) => {
  const adminCount = users.filter(u => u.role === "ADMIN").length;
  const userCount = users.filter(u => u.role === "USER").length;
  const postsWithImages = posts.filter(p => p.picture).length;
  const commentsCount = posts.reduce((acc, p) => acc + (p.comments?.length || 0), 0);
  const avgCommentsPerPost = posts.length > 0 ? (commentsCount / posts.length).toFixed(1) : 0;

  return (
    <div className="stats-card">
      <h2 className="stats-title">Statistiques administrateur</h2>
      <div className="stats-content">
        <div className="stats-item">
          <p className="stats-label">Utilisateurs</p>
          <p className="stats-value">{userCount}</p>
        </div>
        <div className="stats-item">
          <p className="stats-label">Admins</p>
          <p className="stats-value">{adminCount}</p>
        </div>
        <div className="stats-item">
          <p className="stats-label">Posts totaux</p>
          <p className="stats-value">{posts.length}</p>
        </div>
        <div className="stats-item">
          <p className="stats-label">Posts avec image</p>
          <p className="stats-value">{postsWithImages}</p>
        </div>
        <div className="stats-item">
          <p className="stats-label">Commentaires totaux</p>
          <p className="stats-value">{commentsCount}</p>
        </div>
        <div className="stats-item">
          <p className="stats-label">Moy. commentaires/post</p>
          <p className="stats-value">{avgCommentsPerPost}</p>
        </div>
      </div>
    </div>
  );
};
