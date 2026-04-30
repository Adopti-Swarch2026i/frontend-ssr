"use client";

import axios, { AxiosError } from "axios";
import { auth } from "../firebase/firebaseConfig";
import { clientEnv } from "@/lib/env";
import { mapHttpError } from "./errors";

const axiosInstance = axios.create({
  baseURL: clientEnv.NEXT_PUBLIC_PETS_API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  try {
    const user = auth?.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("[axios] token error:", err);
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const detail =
        (error.response.data as { detail?: string; message?: string })?.detail ??
        (error.response.data as { detail?: string; message?: string })?.message ??
        error.message;
      throw mapHttpError(error.response.status, detail);
    }
    throw error;
  }
);

export default axiosInstance;
