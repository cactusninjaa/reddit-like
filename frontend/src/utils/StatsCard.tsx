import '../App.css';

type StatsCardProps = {
  users: any[];
  posts: any[];
};

export const StatsCard = ({ users, posts }: StatsCardProps) => (
  <div className="stats-card">
    <h2 className="stats-title">Statistiques administrateur</h2>
    <div className="stats-content">
      <div className="stats-item">
        <p className="stats-label">Nombre d'utilisateurs</p>
        <p className="stats-value">{users?.length}</p>
      </div>
      <div className="stats-item">  
        <p className="stats-label">Nombre de posts</p>
        <p className="stats-value">{posts?.length}</p>
      </div>
    </div>
  </div>
);
