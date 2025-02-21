"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { User, authService } from "@/services/api";

const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000;
    return Date.now() >= expiryTime - 60000;
  } catch {
    return true;
  }
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  updateUser: (userData: User) => void;
  refreshTokenAndSetUser: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const refreshTokenAndSetUser = async () => {
    try {
      const currentToken = localStorage.getItem("accessToken");
      // Only refresh if token exists and is expiring soon
      if (!currentToken || isTokenExpiringSoon(currentToken)) {
        const response = await authService.refresh();
        if (
          response.accessToken &&
          response.user &&
          response.user.role === "AUTHOR"
        ) {
          localStorage.setItem("accessToken", response.accessToken);
          localStorage.setItem("user", JSON.stringify(response.user));
          setUser(response.user);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Token refresh error:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      router.replace("/error");
      return false;
    }
  };

  useEffect(() => {
    setIsClient(true);
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("accessToken");

        if (storedUser && token && storedUser !== "undefined") {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.role === "AUTHOR") {
            setUser(parsedUser);
            if (isTokenExpiringSoon(token)) {
              await refreshTokenAndSetUser();
            }
          } else {
            throw new Error("Invalid user role");
          }
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        router.replace("/error");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router]);

  useEffect(() => {
    if (isClient && user) {
      const token = localStorage.getItem("accessToken");
      if (token && isTokenExpiringSoon(token)) {
        refreshTokenAndSetUser();
      }

      const refreshInterval = setInterval(async () => {
        const currentToken = localStorage.getItem("accessToken");
        if (currentToken && isTokenExpiringSoon(currentToken)) {
          await refreshTokenAndSetUser();
        }
      }, 14 * 60 * 1000);

      return () => clearInterval(refreshInterval);
    }
  }, [isClient, user]);

  const updateUser = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  if (!isClient || loading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        updateUser,
        refreshTokenAndSetUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
