import pool from '../db/connection';
import { User } from '../types';

export async function getUserById(userId: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT id, username, email, first_name as "firstName", last_name as "lastName", profile_photo_url as "profilePhotoUrl", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0] || null;
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT id, username, email, first_name as "firstName", last_name as "lastName", profile_photo_url as "profilePhotoUrl", created_at as "createdAt", updated_at as "updatedAt" FROM users WHERE username = $1',
    [username]
  );
  return result.rows[0] || null;
}

export async function searchUsers(query: string, limit: number = 10) {
  const result = await pool.query(
    `SELECT id, username, email, first_name as "firstName", last_name as "lastName", profile_photo_url as "profilePhotoUrl"
     FROM users 
     WHERE username ILIKE $1 OR first_name ILIKE $1 OR last_name ILIKE $1
     LIMIT $2`,
    [`%${query}%`, limit]
  );
  return result.rows;
}

export async function getFriendsForUser(userId: string) {
  const result = await pool.query(
    `SELECT u.id, u.username, u.email, u.first_name as "firstName", u.last_name as "lastName", u.profile_photo_url as "profilePhotoUrl", f.status
     FROM users u
     INNER JOIN friendships f ON (
       (f.user_id = $1 AND f.friend_id = u.id) OR
       (f.friend_id = $1 AND f.user_id = u.id)
     )
     WHERE f.status = 'accepted'`,
    [userId]
  );
  return result.rows;
}

export async function getPendingFriendRequests(userId: string) {
  const result = await pool.query(
    `SELECT u.id, u.username, u.email, u.first_name as "firstName", u.last_name as "lastName", u.profile_photo_url as "profilePhotoUrl", f.created_at as "requestDate"
     FROM users u
     INNER JOIN friendships f ON f.user_id = u.id
     WHERE f.friend_id = $1 AND f.status = 'pending'`,
    [userId]
  );
  return result.rows;
}
