import { create } from 'zustand';
import { User, Round, Friend, Rivalry, CareerStats } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

interface RoundState {
  currentRound: Round | null;
  rounds: Round[];
  setCurrentRound: (round: Round | null) => void;
  setRounds: (rounds: Round[]) => void;
  addRound: (round: Round) => void;
}

interface UserState {
  friends: Friend[];
  profile: { stats: CareerStats; rivalries: Rivalry[] } | null;
  setFriends: (friends: Friend[]) => void;
  setProfile: (profile: any) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  return {
    user: user ? JSON.parse(user) : null,
    token: token || null,
    isAuthenticated: !!token,
    setUser: (user) => {
      set({ user });
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    },
    setToken: (token) => {
      set({ token, isAuthenticated: !!token });
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    login: (user, token) => {
      set({ user, token, isAuthenticated: true });
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    logout: () => {
      set({ user: null, token: null, isAuthenticated: false });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  };
});

export const useRoundStore = create<RoundState>((set) => ({
  currentRound: null,
  rounds: [],
  setCurrentRound: (round) => set({ currentRound: round }),
  setRounds: (rounds) => set({ rounds }),
  addRound: (round) => set((state) => ({ rounds: [round, ...state.rounds] })),
}));

export const useUserStore = create<UserState>((set) => ({
  friends: [],
  profile: null,
  setFriends: (friends) => set({ friends }),
  setProfile: (profile) => set({ profile }),
}));
