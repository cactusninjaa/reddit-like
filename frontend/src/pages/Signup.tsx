import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { signupUser } from "../api/api";
import "../App.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: "",
    role: "USER",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);

      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let avatarBase64 = "";

      if (avatarFile) {
        const base64 = await fileToBase64(avatarFile);

        const mimeType = avatarFile.type || "image/jpeg";

        avatarBase64 = `data:${mimeType};base64,${base64.split(",")[1]}`;
      } else {
        avatarBase64 =
          "data:image/jpeg;base64,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";
      }

      const res = await signupUser({ ...formData, avatar: avatarBase64, posts: [] });

      if (res.success) {
        navigate("/login");
      }
    } catch (err) {
      if (err instanceof Error) setError(err.message || "Something went wrong");
      else setError("Something went wrong");
    }
  };


  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🎉 Inscription</h2>
          <p>Rejoignez notre communauté dès maintenant !</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div className="auth-form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                id="firstName"
                name="firstName"
                placeholder="Votre prénom"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                name="lastName"
                placeholder="Votre nom"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              name="username"
              placeholder="Votre pseudo unique"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="votre.email@exemple.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="avatar">Avatar</label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
            />
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar Preview"
                style={{ marginTop: "8px", width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%" }}
              />
            )}
          </div>

          <button type="submit" className="auth-submit-btn">
            ✨ Créer mon compte
          </button>
        </form>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <div className="auth-footer">
          <p>
            Déjà un compte ? <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
