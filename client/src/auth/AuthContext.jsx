// Author: Shayne Lachapelle
import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  // On page load, ask the server whether the login cookie is still valid.
  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  // These throw an ApiError on failure, show err.message to the user.
  async function login(email, password) {
    const data = await api.post("/api/auth/login", { email, password });
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const data = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await api.post("/api/auth/logout");
    // Same priority as React Router's navigate(), so logout + navigate("/") render together.
    // Otherwise ProtectedRoute redirects to /login first.
    startTransition(() => setUser(null));
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
