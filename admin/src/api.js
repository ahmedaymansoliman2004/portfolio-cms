const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// ===== JWT =====
export function getToken() {
  return localStorage.getItem("token");
}

export function saveToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function hasToken() {
  return !!getToken();
}

export function authHeaders(extraHeaders = {}) {
  const token = getToken();

  return {
    ...extraHeaders,
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
}

// ===== AUTH =====
export async function login(username, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Invalid username or password");
  }

  return data;
}

export function logout() {
  removeToken();
}

// ===== CONTENT =====
export async function getContent() {
  const res = await fetch(`${API_URL}/api/content`);

  if (!res.ok) {
    throw new Error("Failed to load content");
  }

  return res.json();
}

export async function saveContent(data) {
  const res = await fetch(`${API_URL}/api/content`, {
    method: "PUT",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to save content");
  }

  return res.json();
}

// ===== CLOUDINARY SIGNATURE =====
export async function getUploadSignature(folder = "portfolio") {
  const res = await fetch(`${API_URL}/api/upload/signature`, {
    method: "POST",
    headers: authHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ folder }),
  });

  if (!res.ok) {
    throw new Error("Failed to get upload signature");
  }

  return res.json();
}

// ===== IMAGE =====
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/upload/image`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Image upload failed");
  }

  return res.json();
}

// ===== MEDIA =====
export async function uploadMedia(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/api/upload/media`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Media upload failed");
  }

  return res.json();
}

export default API_URL;