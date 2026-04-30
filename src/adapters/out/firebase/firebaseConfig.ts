"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { clientEnv } from "@/lib/env";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (typeof window !== "undefined" && clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY) {
  const config = {
    apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  app = getApps().length > 0 ? getApp() : initializeApp(config);
  auth = getAuth(app);
}

export { auth };
export default app;
