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
       id, 
       CASE WHEN user_id_1 = $1 THEN user_id_2 ELSE user_id_1 END as "rivalId",
       CASE WHEN user_id_1 = $1 THEN wins_user_1 ELSE wins_user_2 END as "myWins",
       CASE WHEN user_id_1 = $1 THEN wins_user_2 ELSE wins_user_1 END as "rivalWins",
       ties,
       rounds_played as "roundsPlayed",
       last_round_date as "lastRoundDate",
       last_winner_id as "lastWinnerId"
     FROM rivalries
     WHERE user_id_1 = $1 OR user_id_2 = $1
     ORDER BY rounds_played DESC`,
    [userId]
  );

  return result.rows;
}

export async function getCareerStats(userId: string): Promise<CareerStats> {
  const result = await pool.query(
    `SELECT 
       COUNT(DISTINCT CASE WHEN winner_id = $1 THEN round_id END) as wins,
       COUNT(DISTINCT CASE WHEN loser_id = $1 THEN round_id END) as losses,
       COUNT(DISTINCT CASE WHEN is_tie = true THEN round_id END) as ties
     FROM (
       SELECT 
         r.id as round_id,
         CASE WHEN s1.score < s2.score THEN u1.id ELSE u2.id END as winner_id,
         CASE WHEN s1.score > s2.score THEN u1.id ELSE u2.id END as loser_id,
         s1.score = s2.score as is_tie,
         s1.score as score1,
         s2.score as score2
       FROM rounds r
       JOIN round_participants rp1 ON r.id = rp1.round_id
       JOIN round_participants rp2 ON r.id = rp2.round_id AND rp1.id < rp2.id
       JOIN users u1 ON rp1.user_id = u1.id
       JOIN users u2 ON rp2.user_id = u2.id
     ) scores
     WHERE winner_id = $1 OR loser_id = $1 OR is_tie = true`,
    [userId]
  );

  const stats = result.rows[0] || { wins: 0, losses: 0, ties: 0 };
  const total = parseInt(stats.wins) + parseInt(stats.losses) + parseInt(stats.ties);

  return {
    roundsPlayed: total,
    wins: parseInt(stats.wins),
    losses: parseInt(stats.losses),
    ties: parseInt(stats.ties),
    winPercentage: total > 0 ? (parseInt(stats.wins) / total) * 100 : 0,
  };
}
