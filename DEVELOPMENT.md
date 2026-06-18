# Development Guide - Round Receipts

## Development Environment

Round Receipts consists of two main applications:
- **Backend**: Express.js API server (port 5000)
- **Frontend**: React web application (port 3000)

## Quick Start

### Prerequisites
- PostgreSQL 13+ must be running (or use Docker)
- Node.js 18+

### Option 1: Manual Setup (Recommended for Active Development)

**Step 1: Start PostgreSQL (if not already running)**
```bash
# Using Docker
docker-compose up -d db

# OR ensure local PostgreSQL is running on port 5432
```

**Backend:**
```bash
cd backend
npm install
cp .env.example .env              # Create .env file from template
npm run db:setup                  # Create database tables
npm run db:seed                   # Load sample golf courses
npm run dev                       # Start backend server
```

**Frontend (in another terminal):**
```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

### Option 2: Automated Setup

```bash
# Run the setup script
bash setup.sh

# Then in separate terminals:
cd backend && npm run dev
cd frontend && npm run dev
```

### Option 3: Docker

```bash
docker-compose up -d
```

## Database Setup

The database schema is automatically created when you run:
```bash
npm run db:setup
```

Sample golf courses are seeded with:
```bash
npm run db:seed
```

### Database Tables

**Users & Relationships:**
- `users` - Player accounts
- `friendships` - Friend requests and connections

**Courses & Rounds:**
- `courses` - Golf course information
- `tee_boxes` - Course tee options
- `holes` - Individual hole data
- `rounds` - Round instances
- `round_participants` - Players in rounds
- `scores` - Individual scores

**Competition:**
- `rivalries` - Head-to-head records
- `side_games` - CTP and Long Drive winners

## Frontend Development

### File Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page-level components
├── services/        # API integration
├── store/           # Zustand state management
├── types/           # TypeScript interfaces
├── hooks/           # Custom React hooks
└── styles/          # Tailwind CSS
```

### Key Pages

- **LoginPage** - Authentication entry
- **DashboardPage** - Main dashboard with stats and rivalries
- **CreateRoundPage** - Course and tee box selection
- **RoundScoringPage** - Hole-by-hole score entry with wheel
- **FriendsPage** - Friend management
- **ProfilePage** - Player profiles and rivalry records

### State Management (Zustand)

```typescript
import { useAuthStore, useRoundStore, useUserStore } from '../store'

// Auth store
const { user, token, isAuthenticated, login, logout } = useAuthStore()

// Round store
const { currentRound, rounds, setCurrentRound } = useRoundStore()

// User store
const { friends, profile, setFriends } = useUserStore()
```

### Styling

We use Tailwind CSS for all styling. Custom classes are defined in `src/styles/index.css`:

- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-ghost` - Ghost button
- `.card` - Card container
- `.input` - Input field

### API Integration

```typescript
import api from '../services/api'

// Example
const courses = await api.getCourses()
const round = await api.createRound(courseId, teeBoxId)
await api.submitScore(roundId, holeId, score)
```

## Backend Development

### File Structure

```
src/
├── controllers/      # Route handlers
├── services/         # Business logic
├── routes/          # API route definitions
├── middleware/      # Auth, error handling
├── db/              # Database connection and setup
└── types/           # TypeScript interfaces
```

### Creating a New API Endpoint

1. **Create a controller** in `src/controllers/`:
```typescript
export async function myEndpoint(req: Request, res: Response) {
  // Handle request
  res.json({ data })
}
```

2. **Add route** in `src/routes/`:
```typescript
router.get('/my-endpoint', authenticateToken, myEndpoint)
```

3. **Register route** in `src/index.ts`:
```typescript
app.use('/api/my-resource', myRoutes)
```

### Database Queries

Use the PostgreSQL pool from `src/db/connection.ts`:

```typescript
import pool from '../db/connection'

const result = await pool.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
)
```

### Authentication

Endpoints are protected with JWT authentication:

```typescript
import { authenticateToken } from '../middleware/auth'

router.get('/protected', authenticateToken, handler)

// req.userId contains the authenticated user's ID
export async function handler(req: Request, res: Response) {
  const userId = req.userId!
}
```

## Common Tasks

### Add a New Route

1. Create controller in `src/controllers/`
2. Create/update route file in `src/routes/`
3. Import and register in `src/index.ts`

### Add a New Database Table

1. Add SQL to `src/db/setup.ts`
2. Run `npm run db:setup`

### Add a New API Service Method

Update `src/services/api.ts` to add the new API call.

### Add a New React Component

Create component in `src/components/` and import in pages.

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=round_receipts
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000
```

## Testing

### Manual Testing Workflow

1. **Register a new user**
   - Go to http://localhost:3000/register
   - Create an account

2. **Create a round**
   - Click "Start a Round"
   - Select a course and tee box
   - Add participants

3. **Enter scores**
   - Use the wheel to quickly enter scores
   - Progress through holes

4. **View results**
   - See updated rivalries on dashboard
   - Check player profiles

## Troubleshooting

### Database Connection Errors
- Verify PostgreSQL is running
- Check `.env` credentials
- Ensure database exists: `createdb round_receipts`

### Backend Won't Start
- Check port 5000 is available: `lsof -i :5000`
- Run `npm install` to ensure dependencies
- Check JWT_SECRET is set in `.env`

### Frontend Won't Start
- Check port 3000 is available: `lsof -i :3000`
- Run `npm install` to ensure dependencies
- Clear `.cache` directory

### API Calls Failing
- Check backend is running
- Verify CORS settings in `src/index.ts`
- Check token is being sent correctly

## Code Style

- Use TypeScript for type safety
- Follow naming conventions: camelCase for variables/functions
- Use functional components with hooks
- Add JSDoc comments for complex functions
- Keep components small and focused

## Performance Tips

- Use React.memo for expensive components
- Implement pagination for large lists
- Cache API responses when appropriate
- Lazy load routes with React.lazy
- Optimize database queries with indexes

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push and create pull request
git push origin feature/your-feature
```

## Deployment

See README.md for deployment instructions.

## Support

For issues or questions, check the GitHub issues or ask in discussions.
