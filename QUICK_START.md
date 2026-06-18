# 🏌️ Round Receipts - Quick Start Guide

Get the app running in 5 minutes!

## Prerequisites
- Node.js 18+
- PostgreSQL running locally
- npm or yarn

## Option 1: Quick Start (Recommended)

### 1. Backend Setup (Terminal 1)
```bash
cd backend
npm install
cp .env.example .env
npm run db:setup
npm run db:seed
npm run dev
```

You should see: `Round Receipts API running on port 5000`

### 2. Frontend Setup (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```

You should see: `Local: http://localhost:3000`

### 3. Open in Browser
Navigate to **http://localhost:3000**

---

## Option 2: Automated Setup

```bash
# One-time setup
bash setup.sh

# Then start both servers (in separate terminals)
cd backend && npm run dev
cd frontend && npm run dev
```

---

## Option 3: Docker (No Local Setup)

```bash
docker-compose up -d
```

Access at http://localhost:3000

---

## First Time Using the App

### 1. Register
- Click "Sign up"
- Create username, email, password
- First name and last name (optional but nice)

### 2. Add Friends
- Go to "Friends" page
- Search for other golfers
- Send friend request
- Accept pending requests

### 3. Start a Round
- Click "Start a Round"
- Select a course (4 sample courses included)
- Select tee box (Blue, White, Red)
- Choose 9 or 18 holes

### 4. Enter Scores
- Select player
- Click on score wheel
- Tap score (1-12)
- Scores save automatically
- Advance to next hole

### 5. Complete Round
- After last hole, click "Complete Round"
- Rivalries update automatically
- Check dashboard to see new stats

### 6. View Rivalries
- Go to Profile
- See head-to-head records with all friends
- View career statistics

---

## Sample Test Data

The app comes with 4 famous golf courses:
- Pebble Beach Golf Links
- Augusta National Golf Club
- Bethpage Black
- Torrey Pines Golf Course

Each has 3 tee boxes and full 18-hole data.

---

## Troubleshooting

### "Cannot connect to database"
- Make sure PostgreSQL is running
- Check `.env` has correct credentials
- Try: `psql -U postgres` to verify access

### "Port 5000 already in use"
```bash
# Find process using port 5000
lsof -i :5000
# Kill it
kill -9 <PID>
```

### "Port 3000 already in use"
```bash
lsof -i :3000
kill -9 <PID>
```

### Frontend won't load
- Check backend is running on 5000
- Clear browser cache
- Try: `npm run dev` in frontend folder again

### Database tables not created
```bash
cd backend
npm run db:setup  # Create tables
npm run db:seed   # Add sample courses
```

---

## Environment Variables

Only need to customize if not using defaults.

### Backend (backend/.env)
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=round_receipts
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
```

### Frontend (auto-configured)
Uses backend at `http://localhost:5000`

---

## Next Steps

1. **Read DEVELOPMENT.md** for coding guidelines
2. **Check README.md** for full API docs
3. **Explore the code** - start with `frontend/src/App.tsx`
4. **Start building** - add features!

---

## Key Commands

```bash
# Backend
npm run dev           # Development server
npm run build         # Build for production
npm run db:setup      # Initialize database
npm run db:seed       # Add sample data

# Frontend
npm run dev           # Development server
npm run build         # Build for production
npm run preview       # Preview build locally
```

---

## Architecture Overview

```
Round Receipts
├── Express API (Node.js)
│   └── PostgreSQL Database
└── React Frontend (TypeScript)
    └── Zustand State Management
```

**Data Flow:**
1. React app sends requests to Express API
2. Backend validates and processes requests
3. Database stores/retrieves data
4. Results returned to frontend
5. State updates via Zustand
6. UI re-renders

---

## That's It! 🎉

You're ready to start tracking golf rivalries!

For help, check the docs or open an issue on GitHub.
