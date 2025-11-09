// src/contexts/AuthContext.tsx
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { api } from "../lib/axios";
import type { User } from "../types/api";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Cek token saat load

  useEffect(() => {
    // Cek token saat aplikasi pertama kali dimuat
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Panggil endpoint /me di backend Anda
          const response = await api.get("/auth/me");
          const userData = response.data.data; // Sesuaikan dengan struktur response
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          // Token tidak valid/expired
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    validateToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{ data: { access_token: string; user: User } }>("/auth/login", { email, password });
      const { access_token, user: userData } = response.data.data;

      localStorage.setItem("token", access_token);
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await api.post("/auth/register", { name, email, password });
      return true; // Sukses register
    } catch (error) {
      console.error("Register failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); //
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, logout }}>
      {!loading && children} {/* Jangan render app sampai cek token selesai */}
    </AuthContext.Provider>
  );
};
