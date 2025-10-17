import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/api";

interface HeaderProps {
  onCreatePost: () => void;
  token: string;
  showCreateForm: boolean;
  onLogout: () => void;
  userConnected: any;
}

function Header({ onCreatePost, showCreateForm, token, onLogout, userConnected }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (token) await logoutUser(token);
    } catch (err) {
      console.error("Erreur lors de la déconnexion", err);
    } finally {
      onLogout(); 
      navigate("/login"); 
    }
  };


  const handleAuthorClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/profile/${userConnected._id}`);
  };

  return (
    <div className="header">
      <div className="filter-section">
        <img
            src={userConnected.avatar}
            alt={`Avatar de ${userConnected.firstName}`}
            className="avatar"
        />
        <h1>Hello {userConnected.firstName}</h1>
      </div>
      <div className="filter-section">
        <button className="create-post-btn" onClick={onCreatePost}>
          {showCreateForm ? "Annuler" : "Créer un post"}
        </button>
        <button className="delete-button" onClick={handleLogout}>Déconnecter</button>
        <button onClick={handleAuthorClick}>Voir mon profil</button>
      </div>
    </div>
  );
}

export default Header;
