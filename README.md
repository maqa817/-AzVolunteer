# 🇦🇿 AzVolunteer — Azerbaijan National Volunteer & Technical STEM Platform

A production-grade national volunteer management platform for Azerbaijan, supporting 5,000+ users.
You can see site at https://az-volunteer.vercel.app/ .

---

## 📁 Project Structure

```
azvolunteer/
├── backend/                    # Node.js + Express API
│   ├── prisma/
│   │   ├── schema.prisma       # Full PostgreSQL schema
│   │   └── seed.js             # Database seeder
│   ├── registrations/          # Generated TXT files (private)
│   └── src/
│       ├── controllers/        # Auth, Dashboard, Admin, Applications
│       ├── middleware/         # authMiddleware, adminMiddleware
│       ├── routes/             # All API routes
│       └── utils/              # Prisma client, JWT, file generator, scoring
└── frontend/                   # Next.js 14 App Router
    └── src/
        ├── app/                # Pages: /, /auth, /dashboard, /admin
        ├── components/         # Navbar, layout
        ├── hooks/              # useI18n
        ├── lib/                # API client, AuthContext
        └── locales/            # az.json, en.json
```

---

## 🚀 Quick Start

### 1. Database Setup

```bash
# Install PostgreSQL and create database
createdb azvolunteer

# Configure backend
cd backend
cp .env.example .env
# Edit .env: set DATABASE_URL and JWT_SECRET

# Install dependencies
npm install

# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database (creates admin user + sample projects)
npm run db:seed
```

### 2. Backend

```bash
cd backend
npm run dev
# API running at http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
# Edit: NEXT_PUBLIC_API_URL=http://localhost:5000

npm install
npm run dev
# Frontend at http://localhost:3000
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Volunteer registration |
| POST | `/api/auth/login` | Login (returns JWT) |
| GET | `/api/auth/me` | Get current user |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Full dashboard data |
| PATCH | `/api/dashboard/notifications/:id/read` | Mark notification read |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Apply to project |
| GET | `/api/applications/my` | My applications |

### Admin (require admin JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/users` | List users (paginated, filterable) |
| PATCH | `/api/admin/users/:id/status` | Approve/reject volunteer |
| GET | `/api/admin/projects` | List projects |
| POST | `/api/admin/projects` | Create project |
| DELETE | `/api/admin/projects/:id` | Delete project |
| GET | `/api/admin/applications` | List applications |
| PATCH | `/api/admin/applications/:id/status` | Update application status |
| GET | `/api/admin/files` | List registration TXT files |
| GET | `/api/admin/files/:fileName` | Download TXT file |

---

## 🗄️ Database Tables

| Table | Description |
|-------|-------------|
| `users` | Core user accounts (volunteer/admin roles) |
| `volunteer_profiles` | Full profile: DOB, FIN, city, education, skills |
| `chemical_profiles` | STEM profile: software/lab/industrial skills |
| `projects` | Volunteer projects with skill requirements |
| `applications` | User-project applications with status |
| `certificates` | Awarded certificates |
| `notifications` | User notification inbox |
| `admin_users` | Separate admin user table |

All tables include: `id (UUID)`, `createdAt`, `updatedAt`, `deletedAt` (soft delete).

---

## 🌍 Features

- **Multi-language**: Azerbaijani (AZ) & English (EN) with localStorage persistence
- **Role-based auth**: `volunteer` | `admin` with JWT middleware
- **Chemical Engineering module**: Auto-detected from `fieldOfStudy`, creates chemical profile, calculates technical match score
- **TXT File Generation**: Every registration generates a formatted `.txt` file at `/server/registrations/`
- **Admin Panel**: Approve/reject users, manage projects, download registration files
- **Security**: Helmet, CORS, bcrypt (12 rounds), rate limiting, input validation, path traversal prevention
- **Soft deletes**: All records have `deletedAt` field
- **Connection pooling**: Prisma with PostgreSQL connection pool

---

## 🚢 Deployment

### Frontend → Vercel
```bash
cd frontend
vercel --prod
```

### Backend → Node Server (e.g. Railway, Render, VPS)
```bash
cd backend
npm start
```

Set environment variables:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Strong secret key
- `FRONTEND_URL` — Your Vercel domain
- `NODE_ENV=production`

---

## ⚡ Performance

- Next.js App Router with automatic code splitting
- WebP image support via `next/image`
- API pagination (default 20/page)
- Database indexes on `email` and `phone`
- Rate limiting: 200 req/15min global, 20 req/15min auth
