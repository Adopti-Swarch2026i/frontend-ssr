import { z } from "zod";

const isProd = process.env.NODE_ENV === "production";

const clientSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_PETS_API_URL: z.string().url().default("http://localhost/api"),
  NEXT_PUBLIC_CHAT_GRAPHQL_URL: z.string().url().default("http://localhost/api/chat/graphql"),
  NEXT_PUBLIC_CHAT_WS_URL: z.string().min(1).default("ws://localhost/api/chat/ws"),
  NEXT_PUBLIC_MOCK_MODE: z.enum(["true", "false"]).default("false"),
});

const serverSchema = z.object({
  FIREBASE_ADMIN_PROJECT_ID: z.string().min(1),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.email(),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(1),
  PETS_API_URL_INTERNAL: z.string().url().default("http://gateway/api"),
  CHAT_GRAPHQL_URL_INTERNAL: z.string().url().default("http://gateway/api/chat/graphql"),
  SESSION_COOKIE_NAME: z.string().default("__session"),
  SESSION_DURATION_DAYS: z.coerce.number().int().min(1).max(14).default(5),
  SESSION_CHECK_REVOCATION: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

export type ClientEnv = z.infer<typeof clientSchema>;
export type ServerEnv = z.infer<typeof serverSchema>;

const clientResult = clientSchema.safeParse({
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_PETS_API_URL: process.env.NEXT_PUBLIC_PETS_API_URL,
  NEXT_PUBLIC_CHAT_GRAPHQL_URL: process.env.NEXT_PUBLIC_CHAT_GRAPHQL_URL,
  NEXT_PUBLIC_CHAT_WS_URL: process.env.NEXT_PUBLIC_CHAT_WS_URL,
  NEXT_PUBLIC_MOCK_MODE: process.env.NEXT_PUBLIC_MOCK_MODE,
});

if (!clientResult.success) {
  const msg = `[env] Invalid client env: ${JSON.stringify(clientResult.error.flatten().fieldErrors)}`;
  if (isProd) throw new Error(msg);
  console.warn(msg);
}

export const clientEnv: ClientEnv = clientResult.success
  ? clientResult.data
  : ({
      NEXT_PUBLIC_PETS_API_URL: "http://localhost/api",
      NEXT_PUBLIC_CHAT_GRAPHQL_URL: "http://localhost/api/chat/graphql",
      NEXT_PUBLIC_CHAT_WS_URL: "ws://localhost/api/chat/ws",
      NEXT_PUBLIC_MOCK_MODE: "false",
    } as ClientEnv);

export const isMockMode =
  clientEnv.NEXT_PUBLIC_MOCK_MODE === "true" && !isProd;

let _serverEnv: ServerEnv | null = null;

export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() can only be called on the server");
  }
  if (_serverEnv) return _serverEnv;

  const result = serverSchema.safeParse({
    FIREBASE_ADMIN_PROJECT_ID: process.env.FIREBASE_ADMIN_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    PETS_API_URL_INTERNAL: process.env.PETS_API_URL_INTERNAL,
    CHAT_GRAPHQL_URL_INTERNAL: process.env.CHAT_GRAPHQL_URL_INTERNAL,
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
    SESSION_DURATION_DAYS: process.env.SESSION_DURATION_DAYS,
    SESSION_CHECK_REVOCATION: process.env.SESSION_CHECK_REVOCATION,
  });

  if (!result.success) {
    const msg = `[env] Invalid server env: ${JSON.stringify(result.error.flatten().fieldErrors)}`;
    if (isProd) throw new Error(msg);
    console.warn(msg);
    _serverEnv = {
      FIREBASE_ADMIN_PROJECT_ID: "",
      FIREBASE_ADMIN_CLIENT_EMAIL: "",
      FIREBASE_ADMIN_PRIVATE_KEY: "",
      PETS_API_URL_INTERNAL: "http://gateway/api",
      CHAT_GRAPHQL_URL_INTERNAL: "http://gateway/api/chat/graphql",
      SESSION_COOKIE_NAME: "__session",
      SESSION_DURATION_DAYS: 5,
      SESSION_CHECK_REVOCATION: false,
    };
  } else {
    _serverEnv = result.data;
  }
  return _serverEnv;
}
