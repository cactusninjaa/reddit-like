const API_URL = "http://localhost:3000/api";


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

export const logoutUser = async (token: string) => {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  const result = await res.json();
  if (!res.ok) throw result;
  return result;
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

export const userInfoById = async (id: any) => {
  const res = await fetch(`${API_URL}/users/id/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const result = await res.json();
  if (!res.ok) throw result;
  return result;
};

export const deleteComment = async (userId: string, postId: string, commentId: string) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Token d\'authentification manquant');
  }

  const res = await fetch(`${API_URL}/users/${userId}/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });
  
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression');
  return result;
};