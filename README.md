# Round Receipts 🏌️

Round Receipts is a golf scorekeeping app built around long-term rivalries and friend-group history. Unlike traditional golf apps, Round Receipts focuses on one thing: **Who actually owns the bragging rights?**

## Features

✅ **User Authentication** - Create accounts and manage profiles  
✅ **Friends System** - Add confirmed friends and manage relationships  
✅ **Round Creation** - Select courses, tee boxes, and participants  
✅ **Fast Score Entry** - Wheel-based scoring optimized for mobile  
✅ **Rivalry Engine** - Automatic head-to-head tracking and statistics  
✅ **Side Games** - Record Closest to Pin and Long Drive winners  
✅ **Career Statistics** - Comprehensive win/loss records and metrics  
✅ **Profile Pages** - View detailed rivalries and achievements  

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **State Management**: Zustand
- **HTTP Client**: Axios

## Project Structure

```
RoundReceipts/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth & error handling
│   │   ├── db/            # Database setup
│   │   └── index.ts       # Main app file
│   ├── package.json
│   └── tsconfig.json
├── frontend/          # React web app
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API integration
│   │   ├── store/         # Zustand state
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # Tailwind CSS
│   ├── index.html
│   └── package.json
└── shared/           # Shared utilities (future)
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for PostgreSQL) OR PostgreSQL 13+ running locally
- npm or yarn

### Quick Start (Recommended)

**1. Start PostgreSQL (if not already running)**
```bash
# Using Docker (easiest)
docker-compose up -d db

# OR ensure local PostgreSQL is running on port 5432
```

**2. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env           # .env is now configured for localhost PostgreSQL
npm run db:setup               # Creates all database tables
npm run db:seed                # Loads 4 sample golf courses
npm run dev                    # Starts server on port 5000
```

**3. Frontend Setup (in a new terminal)**
```bash
cd frontend
npm install
npm run dev                    # Starts on port 3000
```

**4. Open in Browser**
Navigate to **http://localhost:3000**

### Default Database Credentials

When you create `.env` from `.env.example`, it uses:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=round_receipts
DB_USER=postgres
DB_PASSWORD=postgres
```

These are pre-configured in the template and work with both Docker and local PostgreSQL installations.

The API will be available at `http://localhost:5000`

---

## Troubleshooting

**"Unable to create account" or database errors?**
- Make sure PostgreSQL is running: `docker-compose up -d db`
- Make sure backend `.env` file exists: `cp backend/.env.example backend/.env`
- Make sure database is set up: `cd backend && npm run db:setup`

**Port 5000 or 3000 already in use?**
- Change the port in `.env` or kill the process using the port

**Frontend can't connect to backend?**
- Make sure backend is running: `cd backend && npm run dev`
- Check that the API URL in frontend `.env` is correct

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Users & Friends
- `GET /api/users/search?q=query` - Search golfers
- `GET /api/users/:userId` - Get user profile
- `POST /api/users/friend-request` - Send friend request
- `PUT /api/users/friend-request/:requestId/accept` - Accept request
- `GET /api/users/:userId/friends` - Get friends list

### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:courseId` - Get course details
- `GET /api/courses/:courseId/tee-boxes/:teeBoxId/holes` - Get holes for tee box

### Rounds
- `POST /api/rounds` - Create new round
- `GET /api/rounds/:roundId` - Get round details
- `POST /api/rounds/:roundId/participants` - Add participants
- `POST /api/rounds/:roundId/scores` - Submit score
- `GET /api/rounds/:roundId/scores/:userId` - Get player scores
- `POST /api/rounds/:roundId/complete` - Complete round
- `POST /api/rounds/:roundId/ctp` - Record Closest to Pin
- `POST /api/rounds/:roundId/long-drive` - Record Long Drive

## Database Schema

### Core Tables
- **users** - User accounts and profiles
- **friendships** - Friend connections and requests
- **courses** - Golf course information
- **tee_boxes** - Course tee options (Blue, White, Red, etc.)
- **holes** - Individual hole par, yardage, handicap

### Round Tables
- **rounds** - Round metadata and status
- **round_participants** - Players in each round
- **scores** - Individual hole scores
- **side_games** - Closest to Pin and Long Drive records

### Rivalry Tables
- **rivalries** - Head-to-head statistics between players

## Key Features Explained

### Rivalry Engine

The rivalry engine automatically tracks head-to-head records between all golfers:

- **Wins/Losses/Ties** - Based on round totals
- **Score Differential** - Average scoring margin over time
- **Historical Record** - Complete game-by-game history
- **Last Result** - Most recent match outcome

When a round is completed, the system automatically:
1. Calculates total scores for each player
2. Compares all pairings (every player vs every other player)
3. Updates rivalry records with new results
4. Updates career statistics

### Score Entry

The score entry experience is optimized for mobile and speed:

- **Wheel-based input** - Quick number selection
- **Color-coded players** - Visual distinction in the wheel
- **Hole-by-hole progression** - Automatic advancement
- **Real-time updates** - Scores saved as entered

## Deployment

### Docker

Build and run with Docker:

```bash
docker-compose up -d
```

### Production Checklist

- [ ] Set strong `JWT_SECRET` in backend
- [ ] Configure PostgreSQL backups
- [ ] Set `NODE_ENV=production`
- [ ] Update CORS origins
- [ ] Set up SSL/HTTPS
- [ ] Configure environment variables for production database
- [ ] Set up database migrations
- [ ] Configure logging and monitoring

## Development Roadmap

### Phase 2
- [ ] Achievements system
- [ ] Leaderboards
- [ ] Tournament mode
- [ ] Mobile app (React Native)
- [ ] Real-time score updates (WebSocket)
- [ ] Photo uploads for profiles

### Phase 3
- [ ] Social features (comments, reactions)
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] Admin panel
- [ ] Handicap integration

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

---

**"Round Receipts is the golf app that remembers every win, every loss, and every rivalry."**
