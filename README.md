# TaskFlow — Smart Task Management Dashboard

A **full-stack** scalable task management web application built with **Next.js 16**, **TailwindCSS v4**, **MongoDB**, and **JWT authentication**. Features a responsive, modern UI with full CRUD operations, user profile management, and protected routes.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)

---

## Features

### Frontend
- **Next.js 16** with App Router and React 19
- **TailwindCSS v4** with custom design system (CSS variables, dark mode)
- Fully **responsive** layout (mobile, tablet, desktop)
- Client-side + server-side **form validation** (Zod)
- **Protected routes** via Next.js middleware (redirects unauthenticated users)
- Animated UI with loading states, error handling, and transitions

### Backend (Next.js API Routes)
- **JWT-based authentication** (signup / login / logout)
- **Password hashing** with bcrypt (10 salt rounds)
- **Profile** fetching and updating
- **Full CRUD** on tasks (Create, Read, Update, Delete)
- **MongoDB** via Mongoose ODM
- Zod validation on all API endpoints
- Proper error handling with meaningful HTTP status codes

### Dashboard
- **User profile card** — view and edit name/email inline
- **Task statistics** — total, completed, in-progress counts
- **Search and filter** — real-time task filtering
- **Inline task editing** — click edit icon to rename tasks
- **Logout flow** — clears JWT cookie and redirects

### Security
- Passwords hashed with **bcrypt**
- **HTTP-only cookies** for JWT (not accessible via JS)
- Token verification middleware on all protected API routes
- Route-level protection via Next.js middleware
- Input validation on both client and server (Zod schemas)
- Users can only access their own tasks (userId-scoped queries)

---

## Project Structure

```
taskflow/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       # POST — login with JWT
│   │   │   ├── logout/route.ts      # POST — clear token cookie
│   │   │   └── register/route.ts    # POST — create account
│   │   ├── profile/route.ts         # GET, PUT — user profile
│   │   └── tasks/
│   │       ├── route.ts             # GET, POST — list & create tasks
│   │       └── [id]/route.ts        # PUT, DELETE — update & delete task
│   ├── dashboard/page.tsx           # Protected dashboard
│   ├── login/page.tsx               # Login form
│   ├── register/page.tsx            # Registration form
│   ├── page.tsx                     # Landing page
│   ├── layout.tsx                   # Root layout
│   └── globals.css                  # Design system & animations
├── components/
│   ├── ProfileCard.tsx              # User profile display/edit
│   ├── TaskForm.tsx                 # Add new task form
│   └── TaskList.tsx                 # Task list with edit/delete
├── lib/
│   ├── auth.ts                      # JWT sign & verify helpers
│   ├── db.ts                        # MongoDB connection
│   └── middleware.ts                # Auth helper (used by API routes)
├── models/
│   ├── User.ts                      # Mongoose User model
│   └── Task.ts                      # Mongoose Task model
├── validations/
│   ├── auth.ts                      # Zod schemas for auth
│   └── task.ts                      # Zod schemas for tasks
├── middleware.ts                     # Next.js route protection middleware
└── package.json
```

---

## Getting Started

### Prerequisites
- **Node.js** 18+
- **MongoDB** (local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/taskflow.git
cd taskflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your-super-secret-key-here
```

> For MongoDB Atlas, use your connection string: `mongodb+srv://user:pass@cluster.mongodb.net/taskflow`

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm start
```

---

## API Documentation

All API routes are under `/api`. Protected routes require a valid JWT token in the `token` HTTP-only cookie.

### Authentication

#### `POST /api/auth/register`
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Validation:** name (min 2 chars), email (valid format), password (min 6 chars)

**Responses:**
| Status | Body |
|--------|------|
| 201 | `{ "message": "User registered" }` |
| 400 | `{ "error": "Password must be at least 6 characters" }` |
| 409 | `{ "error": "Email already registered" }` |

---

#### `POST /api/auth/login`
Authenticate and receive a JWT cookie.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Responses:**
| Status | Body | Cookie |
|--------|------|--------|
| 200 | `{ "message": "Logged in" }` | Sets `token` (httpOnly, 1 day) |
| 400 | `{ "error": "Invalid email address" }` | — |
| 401 | `{ "error": "Invalid email or password" }` | — |

---

#### `POST /api/auth/logout`
Clear the JWT cookie.

**Responses:**
| Status | Body |
|--------|------|
| 200 | `{ "message": "Logged out" }` |

---

### Profile (Protected)

#### `GET /api/profile`
Fetch the authenticated user's profile.

**Responses:**
| Status | Body |
|--------|------|
| 200 | `{ "_id": "...", "name": "John", "email": "john@example.com", "createdAt": "..." }` |
| 401 | `{ "error": "Unauthorized" }` |

---

#### `PUT /api/profile`
Update the authenticated user's name/email.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Responses:**
| Status | Body |
|--------|------|
| 200 | Updated user object |
| 400 | `{ "error": "Name and email are required" }` |
| 409 | `{ "error": "Email already in use" }` |

---

### Tasks (Protected)

#### `GET /api/tasks`
Fetch all tasks for the authenticated user (sorted newest first).

**Response:** `200` — Array of task objects

---

#### `POST /api/tasks`
Create a new task.

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

**Validation:** title (required, min 1 char), description (optional)

**Responses:**
| Status | Body |
|--------|------|
| 201 | Created task object |
| 400 | `{ "error": "Title is required" }` |

---

#### `PUT /api/tasks/:id`
Update an existing task.

**Request Body (partial):**
```json
{
  "title": "Updated title"
}
```

**Responses:**
| Status | Body |
|--------|------|
| 200 | Updated task object |
| 404 | `{ "error": "Task not found" }` |

---

#### `DELETE /api/tasks/:id`
Delete a task.

**Responses:**
| Status | Body |
|--------|------|
| 200 | `{ "message": "Deleted" }` |
| 404 | `{ "error": "Task not found" }` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 + TailwindCSS v4 |
| Auth | JWT (jsonwebtoken) + bcrypt |
| Database | MongoDB (Mongoose 9) |
| Validation | Zod 4 |
| Fonts | Geist Sans & Geist Mono |

---

## Scaling for Production

### Frontend Scaling
1. **Component library** — Extract reusable UI primitives (Button, Input, Card, Modal) into a shared component library to maintain consistency and reduce duplication.
2. **State management** — For larger apps, introduce a state management solution (Zustand, React Query/TanStack Query) to handle server state caching, optimistic updates, and background refetching.
3. **Code splitting** — Next.js automatically code-splits per route. For heavy dashboard widgets, use `React.lazy()` and dynamic imports (`next/dynamic`) to reduce initial bundle size.
4. **CDN & Edge** — Deploy on Vercel/Cloudflare for automatic CDN distribution. Use Next.js Edge Runtime for middleware and lightweight API routes for lower latency.
5. **Image optimization** — Use `next/image` for responsive, lazy-loaded images with automatic WebP conversion.

### Backend Scaling
1. **Separate API service** — For production, migrate API routes to a dedicated Express.js/Fastify/Hono server. This allows independent scaling of frontend (static/SSR) and backend (API) tiers.
2. **Database indexing** — Add MongoDB indexes on frequently queried fields (`userId`, `email`, `createdAt`) to improve query performance.
3. **Connection pooling** — Use MongoDB connection pooling and consider a managed service like MongoDB Atlas with auto-scaling.
4. **Rate limiting** — Add rate limiting middleware (e.g., `express-rate-limit` or Upstash Redis) to prevent abuse on auth endpoints.
5. **Caching** — Implement Redis caching for frequently accessed data (user profiles, task counts) to reduce database load.

### Security Hardening
1. **CSRF protection** — Add CSRF tokens for state-changing requests.
2. **Refresh tokens** — Implement access + refresh token rotation for longer sessions without security compromise.
3. **Input sanitization** — Add server-side sanitization beyond Zod validation for XSS prevention.
4. **CORS** — Configure strict CORS policies when separating frontend and backend.
5. **Monitoring** — Add error tracking (Sentry) and API monitoring for production visibility.

### DevOps
1. **CI/CD** — GitHub Actions for automated testing, linting, and deployment.
2. **Docker** — Containerize the app for consistent environments across dev/staging/production.
3. **Environment management** — Use different `.env` files for development, staging, and production.

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## License

MIT
