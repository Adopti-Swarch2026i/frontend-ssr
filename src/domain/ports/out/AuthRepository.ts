import type { User } from "../../entities/User";

export interface ProfileUpdate {
  displayName?: string;
  phone?: string;
}

export interface AuthRepository {
  signInWithEmail(email: string, password: string): Promise<User>;
  signInWithGoogle(): Promise<User>;
  signUp(email: string, password: string, displayName: string): Promise<User>;
  signOut(): Promise<void>;
  updateProfile(data: ProfileUpdate): Promise<User>;
  getCurrentUser(): User | null;
  getIdToken(): Promise<string | null>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
