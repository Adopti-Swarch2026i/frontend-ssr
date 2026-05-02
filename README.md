# Adopti — Frontend SSR (Next.js 16)

Web app del sistema Adopti. Migración del SPA Vite/React original a **Next.js 16 con App Router** para cumplir el requisito de SSR del Prototipo 2.

Mantiene la **arquitectura Hexagonal** del proyecto original:

```
src/
├── domain/           # Entidades + ports + use cases (framework-agnostic)
├── adapters/
│   ├── in/           # UI (pages, components, hooks)
│   └── out/          # Driven adapters (api, firebase, graphql, websocket)
├── app/              # App Router (Server Components + Route Handlers)
└── lib/              # session, env, helpers
```

---

## Rutas: SSR vs Client

### Server Components (HTML pre-renderizado con datos)

| Ruta              | Datos pre-fetched en servidor                                        |
| ----------------- | -------------------------------------------------------------------- |
| `/`               | Landing pública (estática).                                          |
| `/dashboard`      | `petApiServer.findAll()` + `petApiServer.getStats()` en paralelo.    |
| `/pets/[id]`      | `petApiServer.findById(id)` con `notFound()` server-side en 404.     |
| `/profile`        | `verifySession()` + `petApiServer.findAll({ reporterId: uid })`.     |

Cada Server Component pasa los datos como `initialPets`/`initialPet`/`initialStats` al Client Component correspondiente, que los usa como estado inicial sin volver a fetchear en el primer render. Verifica con `view-source:http://localhost:3000/dashboard`: el HTML inicial contiene los reportes de mascotas.

### Client Components (interactividad, no SSR)

- `/login`, `/chat/*`, `/report`, formularios de creación/edición — requieren WebSocket, popups Firebase, formularios stateful.
- Componentes con `useState`, `useEffect`, `useContext`, `localStorage`, `window`, STOMP, Firebase JS SDK están marcados con `"use client"`.

---

## Auth SSR

1. Cliente hace `signInWithPopup` con Firebase JS SDK → obtiene `idToken`.
2. Cliente envía `POST /api/session` (Route Handler) con el `idToken`.
3. Servidor valida con `firebase-admin.createSessionCookie()` y guarda cookie HTTP-only firmada (`__session`).
4. `app/(protected)/layout.tsx` llama `verifySession()` server-side en cada request — redirige a `/login` si no hay cookie válida.

Archivos clave: `src/lib/session.ts`, `src/app/api/session/route.ts`, `src/adapters/out/firebase/firebaseAdmin.ts`.

---

## Apollo Client SSR

Configurado con `@apollo/client-integration-nextjs` (sucesor de `@apollo/experimental-nextjs-app-support`):

- `src/adapters/out/graphql/apolloClient.tsx` exporta `<ApolloWrapper>` que usa `ApolloNextAppProvider` + `ApolloClient`.
- Solo se usa en `/chat/*` (Client Components), porque chat requiere WebSocket activo y no se beneficia de SSR.

---

## Uploads de imagen

Los uploads usan el **media-service** (Node/TS) vía gateway, no el endpoint viejo de pets-service:

```
POST /api/media/upload   →   media-service:8084
```

Ver `src/adapters/out/api/PetApiAdapter.ts:uploadImages`.

---

## Comandos

```bash
npm run dev      # next dev (puerto 3000)
npm run build    # next build → .next/standalone
npm start        # next start
npm run lint
```

Variables de entorno: ver `.env.example`. Las `NEXT_PUBLIC_*` se inlinen en el bundle cliente; las demás solo viven en el servidor.

## Docker

`Dockerfile` multi-stage que produce imagen Next standalone (~150–200 MB):

```bash
docker build -t adopti-frontend .
docker run -p 3000:3000 --env-file .env adopti-frontend
```

Integrado en `../Compose/docker-compose.yml` como servicio `frontend` con `build: ../frontend-ssr`.
