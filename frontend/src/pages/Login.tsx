import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { loginUser } from "../api/api";

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
        navigate("/");
      }
    } catch (err: any) {
      setError(err.error || "Something went wrong");
    }
  };

    useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
        fetch("http://localhost:3000/api/me", {
        headers: { Authorization: `Bearer ${token}` },
        })
        .then(res => res.json())
        .then(data => {
            if (data.Success) {
                navigate("/main");
            } else {
                localStorage.removeItem("authToken");
            }
        });
    }
    }, [navigate]);
    


  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
