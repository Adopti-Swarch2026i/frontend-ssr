import "server-only";
import { getApps, getApp, initializeApp, cert, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getServerEnv } from "@/lib/env";

let _app: App | null = null;

export function getFirebaseAdmin(): App {
  if (_app) return _app;
  if (getApps().length > 0) {
    _app = getApp();
    return _app;
  }
  const env = getServerEnv();
  _app = initializeApp({
    credential: cert({
      projectId: env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: env.FIREBASE_ADMIN_PRIVATE_KEY,
    }),
  });
  return _app;
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseAdmin());
}
