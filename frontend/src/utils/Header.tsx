import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/api";

interface HeaderProps {
  onCreatePost: () => void;
  token: string;
  showCreateForm: boolean;
  onLogout: () => void;
}

function Header({ onCreatePost, showCreateForm, token, onLogout }: HeaderProps) {
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

  return (
    <div className="header">
      <h1>Reddit-like Posts</h1>
      <div className="filter-section">
        <button className="create-post-btn" onClick={onCreatePost}>
          {showCreateForm ? "Annuler" : "Créer un post"}
        </button>
        <button onClick={handleLogout}>Déconnecter</button>
      </div>
    </div>
  );
}

export default Header;
