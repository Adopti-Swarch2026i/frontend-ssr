"use client";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import type {
  AuthRepository,
  ProfileUpdate,
} from "@/domain/ports/out/AuthRepository";
import type { User } from "@/domain/entities/User";

const PHONE_STORAGE_KEY = "user_phone_";

const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email ?? "",
  displayName: firebaseUser.displayName ?? "",
  photoURL: firebaseUser.photoURL ?? undefined,
  phone:
    typeof window !== "undefined"
      ? localStorage.getItem(PHONE_STORAGE_KEY + firebaseUser.uid) ?? undefined
      : undefined,
});

function requireAuth() {
  if (!auth) {
    throw new Error(
      "Firebase Auth not initialized. Set NEXT_PUBLIC_FIREBASE_API_KEY in .env"
    );
  }
  return auth;
}

async function postSessionCookie(idToken: string): Promise<void> {
  try {
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });
  } catch (err) {
    console.warn("[auth] failed to set session cookie:", err);
  }
}

export class FirebaseAuthAdapter implements AuthRepository {
  async signInWithEmail(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(
      requireAuth(),
      email,
      password
    );
    const idToken = await credential.user.getIdToken();
    await postSessionCookie(idToken);
    return mapFirebaseUser(credential.user);
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(requireAuth(), provider);
    const idToken = await credential.user.getIdToken();
    await postSessionCookie(idToken);
    return mapFirebaseUser(credential.user);
  }

  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<User> {
    const credential = await createUserWithEmailAndPassword(
      requireAuth(),
      email,
      password
    );
    await firebaseUpdateProfile(credential.user, { displayName });
    const idToken = await credential.user.getIdToken();
    await postSessionCookie(idToken);
    return mapFirebaseUser(credential.user);
  }

  async signOut(): Promise<void> {
    try {
      await fetch("/api/session/logout", { method: "DELETE" });
    } catch (err) {
      console.warn("[auth] failed to clear session cookie:", err);
    }
    await signOut(requireAuth());
  }

  async updateProfile(data: ProfileUpdate): Promise<User> {
    const user = requireAuth().currentUser;
    if (!user) throw new Error("No hay usuario autenticado");
    if (data.displayName !== undefined) {
      await firebaseUpdateProfile(user, { displayName: data.displayName });
      await user.reload();
    }
    if (data.phone !== undefined && typeof window !== "undefined") {
      localStorage.setItem(PHONE_STORAGE_KEY + user.uid, data.phone);
    }
    return mapFirebaseUser(user);
  }

  getCurrentUser(): User | null {
    const user = auth?.currentUser;
    return user ? mapFirebaseUser(user) : null;
  }

  async getIdToken(): Promise<string | null> {
    const user = auth?.currentUser;
    if (!user) return null;
    return user.getIdToken();
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return firebaseOnAuthStateChanged(requireAuth(), (firebaseUser) => {
      callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
    });
  }
}
