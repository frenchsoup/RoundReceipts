import pool from '../db/connection';
import { Rivalry, CareerStats } from '../types';

export async function getRivalry(userId1: string, userId2: string): Promise<Rivalry | null> {
  // Always use smaller ID first to maintain consistency
  const [id1, id2] = [userId1, userId2].sort();

  const result = await pool.query(
    `SELECT id, user_id_1 as "userId1", user_id_2 as "userId2", wins_user_1 as "winsUser1", 
            wins_user_2 as "winsUser2", ties, total_score_diff_user_1 as "totalScoreDiffUser1",
            rounds_played as "roundsPlayed", last_round_date as "lastRoundDate", 
            last_winner_id as "lastWinnerId", created_at as "createdAt", updated_at as "updatedAt"
     FROM rivalries 
     WHERE (user_id_1 = $1 AND user_id_2 = $2) OR (user_id_1 = $2 AND user_id_2 = $1)`,
    [id1, id2]
  );

  if (result.rows.length === 0) return null;

  const rivalry = result.rows[0];

  // Normalize data if needed (if user IDs are swapped in DB)
  if (rivalry.userId1 === userId2) {
    return {
      ...rivalry,
      userId1: userId2,
      userId2: userId1,
      winsUser1: rivalry.winsUser2,
      winsUser2: rivalry.winsUser1,
      totalScoreDiffUser1: -rivalry.totalScoreDiffUser1,
    };
  }

  return rivalry;
}

export async function updateRivalry(
  userId1: string,
  userId2: string,
  winsUser1: number,
  winsUser2: number,
  ties: number,
  scoreDiff: number
) {
  const [id1, id2] = [userId1, userId2].sort();

  let query = `
    INSERT INTO rivalries (user_id_1, user_id_2, wins_user_1, wins_user_2, ties, 
                          total_score_diff_user_1, rounds_played, last_round_date, last_winner_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)
    ON CONFLICT (user_id_1, user_id_2) DO UPDATE SET
      wins_user_1 = rivalries.wins_user_1 + $9,
      wins_user_2 = rivalries.wins_user_2 + $10,
      ties = rivalries.ties + $11,
      total_score_diff_user_1 = rivalries.total_score_diff_user_1 + $12,
      rounds_played = rivalries.rounds_played + 1,
      last_round_date = NOW(),
      last_winner_id = $8,
      updated_at = NOW()
    RETURNING *
  `;

  const lastWinnerId = winsUser1 > winsUser2 ? id1 : winsUser2 > winsUser1 ? id2 : null;

  const adjustedWins1 = userId1 === id1 ? winsUser1 : winsUser2;
  const adjustedWins2 = userId1 === id1 ? winsUser2 : winsUser1;
  const adjustedScoreDiff = userId1 === id1 ? scoreDiff : -scoreDiff;

  const result = await pool.query(query, [
    id1,
    id2,
    adjustedWins1,
    adjustedWins2,
    ties,
    adjustedScoreDiff,
    1,
    lastWinnerId,
    adjustedWins1 > adjustedWins2 ? 1 : 0,
    adjustedWins2 > adjustedWins1 ? 1 : 0,
    ties,
    adjustedScoreDiff,
  ]);

  return result.rows[0];
}

export async function getUserRivalries(userId: string) {
  const result = await pool.query(
    `SELECT 
       r.id, 
       CASE WHEN r.user_id_1 = $1 THEN r.user_id_2 ELSE r.user_id_1 END as "rivalId",
       CASE WHEN r.user_id_1 = $1 THEN u2.username ELSE u1.username END as "rivalUsername",
       CASE WHEN r.user_id_1 = $1 THEN u2.first_name ELSE u1.first_name END as "rivalFirstName",
       CASE WHEN r.user_id_1 = $1 THEN u2.last_name ELSE u1.last_name END as "rivalLastName",
       CASE WHEN r.user_id_1 = $1 THEN r.wins_user_1 ELSE r.wins_user_2 END as "myWins",
       CASE WHEN r.user_id_1 = $1 THEN r.wins_user_2 ELSE r.wins_user_1 END as "rivalWins",
       r.ties,
       r.rounds_played as "roundsPlayed",
       r.last_round_date as "lastRoundDate",
       r.last_winner_id as "lastWinnerId"
     FROM rivalries r
     JOIN users u1 ON r.user_id_1 = u1.id
     JOIN users u2 ON r.user_id_2 = u2.id
     WHERE r.user_id_1 = $1 OR r.user_id_2 = $1
     ORDER BY r.rounds_played DESC`,
    [userId]
  );

  return result.rows;
}

export async function getCareerStats(userId: string): Promise<CareerStats> {
  const result = await pool.query(
    `SELECT 
       COALESCE(SUM(CASE WHEN user_id_1 = $1 THEN wins_user_1 ELSE wins_user_2 END), 0) as wins,
       COALESCE(SUM(CASE WHEN user_id_1 = $1 THEN wins_user_2 ELSE wins_user_1 END), 0) as losses,
       COALESCE(SUM(ties), 0) as ties
     FROM rivalries
     WHERE user_id_1 = $1 OR user_id_2 = $1`,
    [userId]
  );

  const stats = result.rows[0] || { wins: 0, losses: 0, ties: 0 };
  const wins = parseInt(stats.wins);
  const losses = parseInt(stats.losses);
  const ties = parseInt(stats.ties);
  const total = wins + losses + ties;

  return {
    roundsPlayed: total,
    wins,
    losses,
    ties,
    winPercentage: total > 0 ? (wins / total) * 100 : 0,
  };
}
