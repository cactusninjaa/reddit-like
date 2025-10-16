const API_URL = "https://reddit-like-backend.vercel.app/api";


export const loginUser = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result;
};

export const signupUser = async (data: any) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result;
};

export const logoutUser = async (data: any) => {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const result = await res.json()
  if (!res.ok) throw result
  return result
}

export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
  const result = await res.json()
  if (!res.ok) throw result
  return result
}

export const userInfo = async (token: any) => {
  const res = await fetch(`${API_URL}/users/${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result;
};
