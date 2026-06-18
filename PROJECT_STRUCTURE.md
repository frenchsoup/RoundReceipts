# Project Structure Overview

```
RoundReceipts/
│
├── 📄 README.md                 # Main documentation
├── 📄 QUICK_START.md            # Get running in 5 minutes
├── 📄 DEVELOPMENT.md            # Development guide & patterns
├── 📄 ARCHITECTURE.md           # System design & database schema
├── 📄 docker-compose.yml        # One-command Docker setup
├── 📄 setup.sh                  # Automated setup script
├── 📄 start.sh                  # Quick start both servers
├── 📄 .gitignore                # Git ignore rules
│
├── 📁 backend/
│   ├── package.json             # Node dependencies
│   ├── tsconfig.json            # TypeScript config
│   ├── Dockerfile               # Container image
│   ├── .env.example             # Environment template
│   │
│   └── src/
│       ├── index.ts             # Express app entry point
│       │
│       ├── db/
│       │   ├── connection.ts     # PostgreSQL pool
│       │   ├── setup.ts          # Create tables
│       │   └── seed.ts           # Sample courses
│       │
│       ├── middleware/
│       │   └── auth.ts           # JWT & error handling
│       │
│       ├── controllers/
│       │   ├── authController.ts     # Register/Login
│       │   ├── userController.ts     # Users & Friends
│       │   ├── roundController.ts    # Round management
│       │   └── courseController.ts   # Course data
│       │
│       ├── services/
│       │   ├── userService.ts        # User queries
│       │   ├── rivalryService.ts     # Rivalry calculations
│       │   ├── roundService.ts       # Round operations
│       │   └── sideGameService.ts    # CTP & Long Drive
│       │
│       ├── routes/
│       │   ├── auth.ts           # POST /auth/login, etc
│       │   ├── users.ts          # GET /users/search, etc
│       │   ├── rounds.ts         # POST /rounds, etc
│       │   └── courses.ts        # GET /courses, etc
│       │
│       └── types/
│           └── index.ts          # TypeScript interfaces
│
├── 📁 frontend/
│   ├── package.json             # React dependencies
│   ├── tsconfig.json            # TypeScript config
│   ├── vite.config.ts           # Vite bundler config
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── postcss.config.cjs        # PostCSS config
│   ├── Dockerfile               # Container image
│   ├── index.html               # HTML entry point
│   │
│   └── src/
│       ├── main.tsx             # React DOM render
│       ├── App.tsx              # Router setup
│       │
│       ├── components/
│       │   ├── Layout.tsx            # Main layout wrapper
│       │   └── ProtectedRoute.tsx    # Auth guard
│       │
│       ├── pages/
│       │   ├── LoginPage.tsx         # /login
│       │   ├── RegisterPage.tsx      # /register
│       │   ├── DashboardPage.tsx     # /dashboard
│       │   ├── CreateRoundPage.tsx   # /rounds/new
│       │   ├── RoundScoringPage.tsx  # /rounds/:id (score wheel)
│       │   ├── RoundsPage.tsx        # /rounds (history)
│       │   ├── FriendsPage.tsx       # /friends
│       │   └── ProfilePage.tsx       # /profile/:id
│       │
│       ├── services/
│       │   └── api.ts           # Axios API client
│       │
│       ├── store/
│       │   └── index.ts          # Zustand stores (auth, round, user)
│       │
│       ├── types/
│       │   └── index.ts          # Frontend TypeScript types
│       │
│       ├── hooks/                # Custom React hooks (placeholder)
│       │
│       └── styles/
│           └── index.css         # Tailwind CSS + custom styles
│
└── 📁 shared/
    └── types.ts                 # Shared TypeScript types

```

---

## File Purposes

### Documentation
- **README.md** - Feature overview, setup, API docs, deployment
- **QUICK_START.md** - Get running in 5 minutes with minimal steps
- **DEVELOPMENT.md** - Coding patterns, workflows, debugging
- **ARCHITECTURE.md** - System design, database schema, data flows

### Setup & Deployment
- **docker-compose.yml** - Single command to start everything
- **setup.sh** - Automated one-time setup for development
- **start.sh** - Quick launcher for backend + frontend
- **Dockerfile** - Container images for both apps

### Backend Files
- **index.ts** - Starts Express server with all routes
- **controllers/** - Handle HTTP requests (validation, responses)
- **services/** - Business logic (queries, calculations)
- **routes/** - Define API endpoints and HTTP methods
- **middleware/** - JWT auth, error handling
- **db/** - Database connection, migrations, seed data
- **types/** - TypeScript interfaces for backend

### Frontend Files
- **App.tsx** - React Router setup and page routing
- **Layout.tsx** - Shared UI (header, nav, footer)
- **pages/** - Full-page components (one per route)
- **services/api.ts** - All HTTP calls to backend
- **store/** - Zustand state for auth, rounds, users
- **styles/index.css** - Tailwind CSS with custom classes
- **types/** - TypeScript interfaces for frontend

### Shared Files
- **types.ts** - Types that can be used by both frontend/backend

---

## Key Entry Points

### Start Backend Development
1. Open: `/backend/src/index.ts` - See Express setup
2. Browse: `/backend/src/routes/` - See available endpoints
3. Check: `/backend/src/controllers/` - See business logic

### Start Frontend Development
1. Open: `/frontend/src/App.tsx` - See routing
2. Browse: `/frontend/src/pages/` - See page components
3. Check: `/frontend/src/services/api.ts` - See API calls

### Add New Feature
1. **Backend**: Add route → controller → service → database
2. **Frontend**: Add page → add navigation → add API call
3. **Database**: Add table to `setup.ts`, run `npm run db:setup`

---

## Running Different Setups

### Local Development (3 terminals)
```bash
# Terminal 1: PostgreSQL
# Already running or: docker run -d postgres

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: Frontend
cd frontend && npm run dev
```

### Docker Setup (1 command)
```bash
docker-compose up -d
# Everything runs in containers
```

### Production
```bash
# Build both apps
cd backend && npm run build
cd frontend && npm run build

# Deploy to your server
# Set NODE_ENV=production
# Update environment variables
# Run: npm start (backend) and serve -s dist (frontend)
```

---

## File Size Reference

- Backend source: ~20 TypeScript files, ~2000 lines total
- Frontend source: ~12 React files, ~3000 lines total
- Database: 9 core tables with indexes
- Total: ~5000 lines of code (well-structured, readable)

---

## Next Steps

1. **Read QUICK_START.md** - Get running
2. **Read DEVELOPMENT.md** - Understand patterns
3. **Explore backend/src/** - See API structure
4. **Explore frontend/src/** - See UI components
5. **Add your own features!**

---

All files are TypeScript for type safety and better developer experience.
