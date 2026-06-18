import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = '/api';

class API {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Auth
  async register(username: string, email: string, password: string, firstName?: string, lastName?: string) {
    const res = await this.client.post('/auth/register', {
      username,
      email,
      password,
      firstName,
      lastName,
    });
    return res.data;
  }

  async login(username: string, password: string) {
    const res = await this.client.post('/auth/login', { username, password });
    return res.data;
  }

  async getCurrentUser() {
    const res = await this.client.get('/auth/me');
    return res.data;
  }

  // Users
  async searchUsers(query: string) {
    const res = await this.client.get('/users/search', { params: { q: query } });
    return res.data;
  }

  async getUserProfile(userId: string) {
    const res = await this.client.get(`/users/${userId}`);
    return res.data;
  }

  async sendFriendRequest(friendId: string) {
    const res = await this.client.post('/users/friend-request', { friendId });
    return res.data;
  }

  async acceptFriendRequest(requestId: string) {
    const res = await this.client.put(`/users/friend-request/${requestId}/accept`);
    return res.data;
  }

  async getFriends(userId: string) {
    const res = await this.client.get(`/users/${userId}/friends`);
    return res.data;
  }

  async getPendingRequests(userId: string) {
    const res = await this.client.get(`/users/${userId}/pending-requests`);
    return res.data;
  }

  // Courses
  async getCourses() {
    const res = await this.client.get('/courses');
    return res.data;
  }

  async getCourseDetails(courseId: string) {
    const res = await this.client.get(`/courses/${courseId}`);
    return res.data;
  }

  async getTeeBoxHoles(courseId: string, teeBoxId: string) {
    const res = await this.client.get(`/courses/${courseId}/tee-boxes/${teeBoxId}/holes`);
    return res.data;
  }

  // Rounds
  async createRound(courseId: string, teeBoxId: string, holesPlayed: number = 18) {
    const res = await this.client.post('/rounds', {
      courseId,
      teeBoxId,
      holesPlayed,
    });
    return res.data;
  }

  async getRound(roundId: string) {
    const res = await this.client.get(`/rounds/${roundId}`);
    return res.data;
  }

  async addParticipants(roundId: string, participantIds: string[], colors?: string[]) {
    const res = await this.client.post(`/rounds/${roundId}/participants`, {
      participantIds,
      colors,
    });
    return res.data;
  }

  async submitScore(roundId: string, holeId: string, score: number) {
    const res = await this.client.post(`/rounds/${roundId}/scores`, {
      holeId,
      score,
    });
    return res.data;
  }

  async getPlayerScores(roundId: string, userId: string) {
    const res = await this.client.get(`/rounds/${roundId}/scores/${userId}`);
    return res.data;
  }

  async completeRound(roundId: string) {
    const res = await this.client.post(`/rounds/${roundId}/complete`);
    return res.data;
  }

  async recordClosestToPin(roundId: string, holeNumber: number, winnerId: string, distance?: string) {
    const res = await this.client.post(`/rounds/${roundId}/ctp`, {
      holeNumber,
      winnerId,
      distance,
    });
    return res.data;
  }

  async recordLongDrive(roundId: string, holeNumber: number, winnerId: string, distance?: string) {
    const res = await this.client.post(`/rounds/${roundId}/long-drive`, {
      holeNumber,
      winnerId,
      distance,
    });
    return res.data;
  }

  async getSideGames(roundId: string) {
    const res = await this.client.get(`/rounds/${roundId}/side-games`);
    return res.data;
  }

  async getUserRounds() {
    const res = await this.client.get('/rounds/user/rounds');
    return res.data;
  }
}

export default new API();
