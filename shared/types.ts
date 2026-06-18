// Shared types that can be used across backend and frontend

export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePhotoUrl?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Course {
  id: string;
  name: string;
  location?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface TeeBox {
  id: string;
  courseId: string;
  name: string;
  color?: string;
  rating?: number;
  slope?: number;
  createdAt: string | Date;
}

export interface Hole {
  id: string;
  teeBoxId: string;
  holeNumber: number;
  par: number;
  yardage?: number;
  handicap?: number;
  createdAt: string | Date;
}

export interface Round {
  id: string;
  courseId: string;
  teeBoxId: string;
  scorekeeperId: string;
  holesPlayed: number;
  status: 'in_progress' | 'completed' | 'cancelled';
  createdAt: string | Date;
  completedAt?: string | Date;
}

export interface RoundParticipant {
  id: string;
  roundId: string;
  userId: string;
  color?: string;
  status: 'confirmed' | 'pending' | 'declined';
  createdAt: string | Date;
}

export interface Score {
  id: string;
  roundId: string;
  holeId: string;
  userId: string;
  score: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface SideGame {
  id: string;
  roundId: string;
  gameType: 'ctp' | 'long_drive';
  holeNumber: number;
  winnerId: string;
  distanceOrDetails?: string;
  createdAt: string | Date;
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
  lastRoundDate?: string | Date;
  lastWinnerId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
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

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
}

export interface AuthRequest {
  username: string;
  email?: string;
  password: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
