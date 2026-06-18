# Round Receipts - Architecture & Design

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Browser                            │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Frontend (Port 3000)                   │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐   │   │
│  │  │  Dashboard  │ │   Rounds    │ │    Friends   │   │   │
│  │  └─────────────┘ └─────────────┘ └──────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │      Score Entry Wheel UI (Mobile)          │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │    Zustand State Management Store           │   │   │
│  │  │  (auth, rounds, users, friends)             │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────┬────────────────────────────────────────────────┘
             │
        HTTP/REST
             │
┌────────────▼────────────────────────────────────────────────┐
│         Express API Server (Port 5000)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Routes: /api/auth, /api/users, /api/rounds, etc   │   │
│  │  Middleware: JWT Auth, Error Handling              │   │
│  │  Controllers: Business Logic                       │   │
│  │  Services: Data Operations                         │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────┬────────────────────────────────────────────────┘
             │
        SQL Queries
             │
┌────────────▼────────────────────────────────────────────────┐
│         PostgreSQL Database                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Users │ Friendships │ Courses │ Tee Boxes │ Holes   │   │
│  │ Rounds │ Participants │ Scores │ Side Games         │   │
│  │ Rivalries (Core Feature)                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Complete a Round

```
User Completes Round
        ↓
   Frontend sends POST /api/rounds/{id}/complete
        ↓
Backend: roundController.completeRound()
        ↓
   ✓ Get all participants
   ✓ Calculate total scores
   ✓ Compare all pairings
        ↓
For each pairing (User1 vs User2):
        ↓
   determineWinner(score1, score2)
        ↓
   UPDATE rivalries table:
   - Increment wins/losses/ties
   - Add score differential
   - Update last_round_date
        ↓
Frontend receives updated rivalries
        ↓
Update Zustand store
        ↓
Re-render Dashboard with new stats
```

---

## Database Schema

### 1. Authentication & Users
```sql
users
├── id (UUID, primary key)
├── username (unique)
├── email (unique)
├── password_hash
├── first_name
├── last_name
├── profile_photo_url
└── timestamps
```

### 2. Relationships
```sql
friendships
├── id
├── user_id → users
├── friend_id → users
├── status (pending/accepted)
└── timestamps
```

### 3. Courses & Holes
```sql
courses                          tee_boxes
├── id                          ├── id
├── name                        ├── course_id → courses
├── location                    ├── name (Blue/White/Red)
└── timestamps                  ├── color, rating, slope
                                └── timestamps

holes
├── id
├── tee_box_id → tee_boxes
├── hole_number (1-18)
├── par
├── yardage
└── handicap
```

### 4. Rounds & Scoring
```sql
rounds                          round_participants
├── id                          ├── id
├── course_id → courses         ├── round_id → rounds
├── tee_box_id → tee_boxes      ├── user_id → users
├── scorekeeper_id → users      ├── color (visual identifier)
├── holes_played (9 or 18)      ├── status
├── status                      └── timestamps
└── timestamps

scores
├── id
├── round_id → rounds
├── hole_id → holes
├── user_id → users
├── score (1-12+)
└── timestamps
```

### 5. Competition
```sql
side_games
├── id
├── round_id → rounds
├── game_type (ctp/long_drive)
├── hole_number
├── winner_id → users
├── distance_or_details
└── timestamps

rivalries (CORE FEATURE)
├── id
├── user_id_1 → users
├── user_id_2 → users
├── wins_user_1
├── wins_user_2
├── ties
├── total_score_diff_user_1
├── rounds_played
├── last_round_date
├── last_winner_id
└── timestamps
```

---

## API Endpoint Structure

```
/api/auth
├── POST   /register          (Create account)
├── POST   /login             (Get JWT token)
└── GET    /me                (Current user)

/api/users
├── GET    /search            (Search golfers)
├── GET    /:userId           (Profile + stats)
├── POST   /friend-request    (Send request)
├── PUT    /friend-request/:id/accept
└── GET    /:userId/friends   (Friends list)

/api/courses
├── GET    /                  (All courses)
├── GET    /:courseId         (Course details + tee boxes)
└── GET    /:courseId/tee-boxes/:id/holes

/api/rounds
├── POST   /                  (Create round)
├── GET    /:roundId          (Round details)
├── POST   /:roundId/participants
├── POST   /:roundId/scores   (Submit score)
├── GET    /:roundId/scores/:userId
├── POST   /:roundId/complete (Finalize + update rivalries)
├── POST   /:roundId/ctp      (Closest to pin)
├── POST   /:roundId/long-drive
└── GET    /:roundId/side-games
```

---

## Frontend Component Hierarchy

```
App
├── BrowserRouter
└── Routes
    ├── /login → LoginPage
    ├── /register → RegisterPage
    └── Layout (Protected)
        ├── Header (Nav + Logout)
        ├── MainContent
        │   ├── /dashboard → DashboardPage
        │   ├── /rounds → RoundsPage
        │   ├── /rounds/new → CreateRoundPage
        │   ├── /rounds/:id → RoundScoringPage
        │   │   └── ScoreWheel Component
        │   ├── /friends → FriendsPage
        │   └── /profile/:id → ProfilePage
        └── Footer (optional)
```

---

## State Management (Zustand)

### Auth Store
```typescript
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  // Methods: setUser, setToken, login, logout
}
```

### Round Store
```typescript
interface RoundState {
  currentRound: Round | null
  rounds: Round[]
  // Methods: setCurrentRound, setRounds, addRound
}
```

### User Store
```typescript
interface UserState {
  friends: Friend[]
  profile: { stats, rivalries }
  // Methods: setFriends, setProfile
}
```

---

## Score Entry UX

```
┌─────────────────────────────────┐
│  Hole 1 (Par 4) - 385 yards    │
├─────────────────────────────────┤
│                                 │
│     ┌───────────────┐          │
│     │     Score     │          │
│     │   [empty]     │          │
│     └───────────────┘          │
│          ▼ tap                  │
│                                 │
│   Score Wheel Appears:         │
│   ┌─────────────────┐          │
│   │  1  2  3  4  5 │          │
│   │  6  7  8  9  10│          │
│   │  11 12         │          │
│   └─────────────────┘          │
│          ▼ select 4             │
│                                 │
│   Score Updated to 4           │
│   Auto-advance to Hole 2       │
└─────────────────────────────────┘
```

---

## Key Features Implementation

### 1. Rivalry Engine
- Triggers on round completion
- Compares all player pairings
- Updates win/loss/tie counts
- Tracks score differential
- Maintains historical record

### 2. Mobile-Optimized Score Entry
- Large touch targets
- Minimal scrolling
- Color-coded wheels per player
- Auto-progression through holes
- Real-time validation

### 3. Friend System
- Request-based (prevents spam)
- Bi-directional relationships
- Status tracking (pending/accepted)
- Search functionality

### 4. Career Statistics
- Aggregated from all rivalries
- Win percentage calculation
- Best/worst round tracking
- Head-to-head averages

---

## Security Considerations

### Authentication
- JWT tokens stored in localStorage
- Tokens expire after 7 days
- Bearer token in Authorization header

### Database
- Parameterized queries (SQL injection prevention)
- Foreign key constraints
- Unique constraints on relationships

### API
- CORS configured for frontend URL only
- Protected endpoints require authentication
- Password hashed with bcryptjs

### Production Checklist
- Change JWT_SECRET
- Set NODE_ENV=production
- Configure HTTPS
- Set secure CORS origins
- Enable database backups
- Add rate limiting
- Set up monitoring

---

## Performance Optimizations

### Frontend
- React.memo for expensive components
- Zustand for efficient state updates
- Tailwind CSS for minimal CSS
- Vite for fast dev/build

### Backend
- Database indexes on frequently queried columns
- Connection pooling with pg
- Parameterized queries
- Response pagination

### Database
- Indexed user_id, friend_id, round_id
- Foreign key constraints
- Transaction support for critical operations

---

## Deployment Options

### Option 1: Docker Compose (Recommended for dev)
```bash
docker-compose up -d
```

### Option 2: Heroku / Railway
- Push backend folder
- Connect PostgreSQL addon
- Set environment variables

### Option 3: VPS / EC2
- Install Node.js, PostgreSQL
- Clone repository
- Install dependencies
- Configure environment
- Set up reverse proxy (nginx)
- Enable HTTPS (Let's Encrypt)

---

## Technology Choices Explained

| Tech | Why |
|------|-----|
| React | Fast UI, component reusability |
| TypeScript | Type safety, better DX |
| Tailwind | Rapid UI development, consistency |
| Zustand | Lightweight state management |
| Express | Minimal, fast Node.js framework |
| PostgreSQL | Reliable, powerful relational DB |
| JWT | Stateless authentication |
| bcryptjs | Secure password hashing |

---

This architecture provides:
✅ Clean separation of concerns  
✅ Scalable database design  
✅ Type-safe frontend and backend  
✅ Mobile-first UX  
✅ Real-time rivalry calculations  
✅ Easy deployment options
