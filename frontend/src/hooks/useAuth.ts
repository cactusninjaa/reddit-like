import { useState, useEffect } from "react";

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));

  const saveToken = (newToken: string) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
  };

  const clearToken = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("expiresAt");
    setToken(null);
  };

  return { token, saveToken, clearToken };
};