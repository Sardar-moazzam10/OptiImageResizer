import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { API_ENDPOINTS, ROUTES } from "@/lib/constants";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, InsertUser>;
};

type LoginData = Pick<InsertUser, "username" | "password">;

const AUTH_STORAGE_KEY = "auth_state";

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Load initial auth state from storage
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        queryClient.setQueryData(["/api/user"], parsedAuth);
      } catch (error) {
        console.error("Failed to parse stored auth:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const {
    data: user,
    error,
    isLoading,
    refetch: refetchUser
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({
      on401: "returnNull",
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000 // 30 minutes
    }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      try {
        const res = await apiRequest("POST", API_ENDPOINTS.auth.login, credentials);
        if (!res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const error = await res.json();
            throw new Error(error.message || "Login failed");
          } else {
            throw new Error("Server error: Invalid response format");
          }
        }
        const data = await res.json();
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Network error during login");
      }
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.username}!`,
      });
      setLocation(ROUTES.home);
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      // Clear any stale auth data
      localStorage.removeItem(AUTH_STORAGE_KEY);
      queryClient.setQueryData(["/api/user"], null);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: InsertUser) => {
      try {
        const res = await apiRequest("POST", API_ENDPOINTS.auth.register, credentials);
        if (!res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const error = await res.json();
            throw new Error(error.message || "Registration failed");
          } else {
            throw new Error("Server error: Invalid response format");
          }
        }
        const data = await res.json();
        return data;
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Network error during registration");
      }
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      toast({
        title: "Registration successful",
        description: `Welcome to Optisizer, ${user.username}!`,
      });
      setLocation(ROUTES.home);
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        const res = await apiRequest("POST", API_ENDPOINTS.auth.logout);
        if (!res.ok) {
          throw new Error("Logout failed");
        }
      } catch (error) {
        throw error instanceof Error ? error : new Error("Network error");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      queryClient.clear(); // Clear all queries on logout
      toast({
        title: "Logged out successfully",
      });
      setLocation(ROUTES.auth);
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Session check interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        refetchUser();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [user, refetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        isAuthenticated: !!user,
        loginMutation,
        logoutMutation,
        registerMutation,
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
