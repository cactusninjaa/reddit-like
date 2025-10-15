interface HeaderProps {
  onCreatePost: () => void;
  showCreateForm: boolean;
}

function Header({ onCreatePost, showCreateForm }: HeaderProps) {
  return (
    <div className="header">
      <h1>Reddit-like Posts</h1>
      <div className="filter-section">
        <button
          className="create-post-btn"
          onClick={onCreatePost}
        >
          {showCreateForm ? 'Annuler' : 'Créer un post'}
        </button>
      </div>
    </div>
  );
}

export default Header;