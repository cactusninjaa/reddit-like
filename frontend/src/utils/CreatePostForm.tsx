import { useState } from 'react';

interface NewPost {
  title: string;
  description: string;
  picture: string;
  userId: string;
}

interface CreatePostFormProps {
  onSubmit: (post: NewPost) => void;
  onCancel: () => void;
  isCreating: boolean;
}

function CreatePostForm({ onSubmit, onCancel, isCreating }: CreatePostFormProps) {
  const [newPost, setNewPost] = useState<NewPost>({
    title: '',
    description: '',
    picture: '',
    userId: ''
  });

  const handleSubmit = () => {
    if (!newPost.title || !newPost.description) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onSubmit(newPost);
    setNewPost({
      title: '',
      description: '',
      picture: '',
      userId: ''
    });
  };

  return (
    <div className="create-post-form">
      <h3>Créer un nouveau post</h3>

      <div className="form-group">
        <label>Titre *</label>
        <input
          type="text"
          placeholder="Titre du post"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Description *</label>
        <textarea
          placeholder="Description du post"
          value={newPost.description}
          onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div className="form-group">
        <label>URL de l'image (optionnel)</label>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={newPost.picture}
          onChange={(e) => setNewPost({ ...newPost, picture: e.target.value })}
        />
      </div>

      <div className="form-actions">
        <button
          onClick={onCancel}
          className="secondary"
          type="button"
        >
          Annuler
        </button>
        <button
          onClick={handleSubmit}
          disabled={isCreating}
          type="button"
        >
          {isCreating ? '⏳ Création...' : '✨ Créer le post'}
        </button>
      </div>
    </div>
  );
}

export default CreatePostForm;