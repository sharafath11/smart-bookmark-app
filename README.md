# Smart Bookmark App

Google‑only bookmark manager with private, realtime updates across tabs.

## Requirements Covered
- Google OAuth only (no email/password)
- Add bookmarks (title + URL)
- Private data per user
- Realtime updates across multiple tabs
- Delete bookmarks
- Vercel deployment ready

## Tech Stack
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript, MongoDB (Mongoose)
- Realtime: Socket.io

## Live Demo
- Vercel URL: https://smart-bookmark-app-eight-sand.vercel.app
- Render API: https://smart-bookmark-app.onrender.com
- GitHub Repo: https://github.com/sharafath11/smart-bookmark-app

## Local Setup

### 1) Backend
```bash
cd server
npm install
```

Create `server/.env`:
```bash
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret
GOOGLE_CLIENT_ID=your_google_client_id
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

Run backend:
```bash
npm run dev
```

### 2) Frontend
```bash
cd client
npm install
```

Create `client/.env`:
```bash
NEXT_PUBLIC_BASEURL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

Run frontend:
```bash
npm run dev
```

## Deployment Notes
**Frontend (Vercel)**
- Set env variables:
  - `NEXT_PUBLIC_BASEURL` = `https://your-backend-domain/api`
  - `NEXT_PUBLIC_SOCKET_URL` = `https://your-backend-domain`
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = your Google OAuth client ID

**Backend (Render/Railway/Fly.io)**
- Set env variables:
  - `MONGO_URI`, `JWT_SECRET`, `REFRESH_SECRET`, `GOOGLE_CLIENT_ID`
  - `CLIENT_ORIGIN` = your Vercel domain (no trailing slash)
  - `NODE_ENV=production` for secure cookies

## Realtime Behavior
Socket.io authenticates using the HTTP‑only cookie during the websocket handshake, then joins a private room (`user:{userId}`). When a bookmark is created or deleted, the server emits `bookmarks:changed` to that room so all open tabs refresh instantly.

## Middleware Note (Production)
Because the backend is on Render and the frontend is on Vercel (different domains), browser cookies set by the backend are not readable by Vercel’s middleware. To keep route protection while still enforcing backend auth, the app sets a lightweight `sb_auth` cookie on the Vercel domain after successful login and `/auth/me`. The middleware checks this flag for routing, while real access control is still validated by the backend.

## Problems I Faced & Fixes
No major blockers. Any expected integration issues (OAuth, CORS, cookies) were identified quickly and resolved during setup.

## API Endpoints
- `POST /api/auth/google` → login with Google ID token
- `GET /api/auth/me` → current user
- `POST /api/auth/logout` → logout
- `POST /api/auth/refresh-token` → refresh access token
- `GET /api/bookmarks` → list bookmarks
- `POST /api/bookmarks` → add bookmark
- `DELETE /api/bookmarks/:id` → remove bookmark
