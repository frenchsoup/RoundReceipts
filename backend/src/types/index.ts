export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePhotoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeeBox {
  id: string;
  courseId: string;
  name: string;
  color?: string;
  rating?: number;
  slope?: number;
  createdAt: Date;
}

export interface Hole {
  id: string;
  teeBoxId: string;
  holeNumber: number;
  par: number;
  yardage?: number;
  handicap?: number;
  createdAt: Date;
}

export interface Round {
  id: string;
  courseId: string;
  teeBoxId: string;
  scorekeeperId: string;
  holesPlayed: number;
  status: 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
}

export interface RoundParticipant {
  id: string;
  roundId: string;
  userId: string;
  color?: string;
  status: 'confirmed' | 'pending' | 'declined';
  createdAt: Date;
}

export interface Score {
  id: string;
  roundId: string;
  holeId: string;
  userId: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SideGame {
  id: string;
  roundId: string;
  gameType: 'ctp' | 'long_drive';
  holeNumber: number;
  winnerId: string;
  distanceOrDetails?: string;
  createdAt: Date;
}

export interface Rivalry {
  id: string;
  userId1: string;
  userId2: string;
  winsUser1: number;
  winsUser2: number;
  ties: number;
  totalScoreDiffUser1: number;
  roundsPlayed: number;
  lastRoundDate?: Date;
  lastWinnerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
}

export interface AuthRequest {
  username: string;
  email: string;
  password: string;
}

export interface CareerStats {
  roundsPlayed: number;
  wins: number;
  losses: number;
  ties: number;
  winPercentage: number;
  averageScore?: number;
  bestRound?: number;
  worstRound?: number;
}
