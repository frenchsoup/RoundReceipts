import { Request, Response } from 'express';
import pool from '../db/connection';
import * as userService from '../services/userService';
import * as rivalryService from '../services/rivalryService';

export async function getProfile(req: Request, res: Response) {
  try {
    const { userId } = req.params;

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const stats = await rivalryService.getCareerStats(userId);
    const rivalries = await rivalryService.getUserRivalries(userId);

    res.json({ user, stats, rivalries });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
}

export async function searchGolfers(req: Request, res: Response) {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    const results = await userService.searchUsers(q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
}

export async function sendFriendRequest(req: Request, res: Response) {
  try {
    const { friendId } = req.body;
    const userId = req.userId!;

    if (!friendId) {
      return res.status(400).json({ error: 'Friend ID required' });
    }

    // Check if friend exists
    const friend = await userService.getUserById(friendId);
    if (!friend) {
      return res.status(404).json({ error: 'User not found' });
    }

    const result = await pool.query(
      `INSERT INTO friendships (user_id, friend_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING id, user_id as "userId", friend_id as "friendId", status`,
      [userId, friendId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Friendship request already exists' });
    }
    res.status(500).json({ error: 'Failed to send friend request' });
  }
}

export async function acceptFriendRequest(req: Request, res: Response) {
  try {
    const { requestId } = req.params;
    const userId = req.userId!;

    const result = await pool.query(
      `UPDATE friendships 
       SET status = 'accepted', updated_at = NOW()
       WHERE id = $1 AND friend_id = $2
       RETURNING id, user_id as "userId", friend_id as "friendId", status`,
      [requestId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept request' });
  }
}

export async function getFriends(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const friends = await userService.getFriendsForUser(userId);
    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
}

export async function getPendingRequests(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const requests = await userService.getPendingFriendRequests(userId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
}
