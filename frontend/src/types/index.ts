export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePhotoUrl?: string;
  createdAt: Date;
}

export interface Round {
  id: string;
  courseId: string;
  courseName: string;
  teeBoxId: string;
  teeBoxName: string;
  scorekeeperId: string;
  holesPlayed: number;
  status: 'in_progress' | 'completed';
  createdAt: Date;
  completedAt?: Date;
  participants: RoundParticipant[];
  holes: Hole[];
}

export interface RoundParticipant {
  id: string;
  userId: string;
  color?: string;
  status: string;
}

export interface Hole {
  id: string;
  holeNumber: number;
  par: number;
  yardage?: number;
  handicap?: number;
}

export interface Score {
  id: string;
  holeId: string;
  holeNumber: number;
  par: number;
  score: number;
}

export interface SideGame {
  id: string;
  gameType: 'ctp' | 'long_drive';
  holeNumber: number;
  winnerId: string;
  winnerName: string;
  details?: string;
}

export interface Rivalry {
  id: string;
  rivalId: string;
  myWins: number;
  rivalWins: number;
  ties: number;
  roundsPlayed: number;
  lastRoundDate?: Date;
  lastWinnerId?: string;
}

export interface CareerStats {
  roundsPlayed: number;
  wins: number;
  losses: number;
  ties: number;
  winPercentage: number;
}

export interface Course {
  id: string;
  name: string;
  location?: string;
  teeBoxes?: TeeBox[];
}

export interface TeeBox {
  id: string;
  name: string;
  color?: string;
  rating?: number;
  slope?: number;
}

export interface Friend {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profilePhotoUrl?: string;
}
