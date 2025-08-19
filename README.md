## Quix

AI-powered, chat-based quiz app. Paste any topic and get an interactive quiz with instant feedback and guest (zero-signup) access.


https://github.com/user-attachments/assets/298e1303-1a26-4512-9adb-c92874d557f2


### Tech Stack
- Next.js 15 (App Router), React 19, TypeScript
- Tailwind CSS 4, Framer Motion
- TanStack Query v5

### Prerequisites
- Node.js >= 18
- npm or pnpm

### Quick Start
1) Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_BACKEND_ORIGIN=http://127.0.0.1:8787
```

2) Install and run:

```bash
npm install
npm run dev
# open http://localhost:3000
```

Build and run production:

```bash
npm run build
npm start
```

### Environment
- `NEXT_PUBLIC_BACKEND_ORIGIN` (required): Base URL for the backend used by Next.js rewrites. Defaults to `http://127.0.0.1:8787` if not set.

### API Routing
Requests to `/api/*` are proxied to the backend origin via Next.js rewrites (configured in `next.config.ts`).

### Scripts
- `dev` — start the development server
- `build` — build for production
- `start` — run the production server
- `lint` — run Next.js lint
