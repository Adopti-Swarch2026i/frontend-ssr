"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@/domain/entities/User";
import type { ProfileUpdate } from "@/domain/ports/out/AuthRepository";
import { useDependencies } from "./DependencyContext";

interface AuthState {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: ProfileUpdate) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { authRepository } = useDependencies();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authRepository.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, [authRepository]);

  const loginWithGoogle = useCallback(async () => {
    const u = await authRepository.signInWithGoogle();
    setUser(u);
  }, [authRepository]);

  const logout = useCallback(async () => {
    await authRepository.signOut();
    setUser(null);
  }, [authRepository]);

  const updateProfile = useCallback(
    async (data: ProfileUpdate) => {
      const updated = await authRepository.updateProfile(data);
      setUser(updated);
    },
    [authRepository]
  );

  const value = useMemo<AuthState>(
    () => ({ user, loading, loginWithGoogle, logout, updateProfile }),
    [user, loading, loginWithGoogle, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
