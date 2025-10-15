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
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await signupUser({ ...formData, posts: [] });
      if (res.Success) {
        alert("Signup successful");
        navigate("/login");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
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
            <label htmlFor="role">Rôle</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="USER">👤 Utilisateur</option>
              <option value="ADMIN">👑 Administrateur</option>
            </select>
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
