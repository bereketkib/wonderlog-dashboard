import axios from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "AUTHOR" | "USER";
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// Add token expiry check utility
const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiryTime = payload.exp * 1000;
    return Date.now() >= expiryTime - 60000; // Check if token expires in 1 minute
  } catch {
    return true;
  }
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Update request interceptor to handle proactive token refresh
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (isTokenExpiringSoon(token) && config.url !== "/auth/refresh") {
        try {
          const response = await authService.refresh();
          if (response.accessToken) {
            localStorage.setItem("accessToken", response.accessToken);
            config.headers.Authorization = `Bearer ${response.accessToken}`;
            return config;
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
        }
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshEndpoint = originalRequest.url === "/auth/refresh";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshEndpoint
    ) {
      originalRequest._retry = true;

      try {
        const response = await api.post<AuthResponse>("/auth/refresh");
        const { accessToken, user } = response.data;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("user", JSON.stringify(user));
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  async refresh(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/refresh");
    if (response.data.user) {
      console.log("accesstoken refreshed");
    }
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};

export default api;
