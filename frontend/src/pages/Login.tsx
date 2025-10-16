import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { loginUser } from "../api/api";
import "../App.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginUser({ email, password });
      console.log(res)
      if (res.Success) {
        localStorage.setItem("authToken", res.token);
        localStorage.setItem("expiresAt", res.expiresAt);
        navigate("/");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    }
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");

  //   if (token) {
  //     fetch("http://localhost:3000/api/me", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     })
  //       .then(res => res.json())
  //       .then(data => {
  //         if (data.Success) {
  //           navigate("/main");
  //         } else {
  //           localStorage.removeItem("authToken");
  //         }
  //       });
  //   }
  // }, [navigate]);


  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🚀 Connexion</h2>
          <p>Bienvenue ! Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="votre.email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            ✨ Se connecter
          </button>
        </form>

        {error && (
          <div className="auth-error">
            ⚠️ {error}
          </div>
        )}

        <div className="auth-footer">
          <p>
            Pas encore de compte ? <Link to="/signup">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
