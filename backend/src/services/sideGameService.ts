import pool from '../db/connection';

export async function recordSideGame(
  roundId: string,
  gameType: 'ctp' | 'long_drive',
  holeNumber: number,
  winnerId: string,
  details?: string
) {
  const result = await pool.query(
    `INSERT INTO side_games (round_id, game_type, hole_number, winner_id, distance_or_details)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, round_id as "roundId", game_type as "gameType", hole_number as "holeNumber",
               winner_id as "winnerId", distance_or_details as "details", created_at as "createdAt"`,
    [roundId, gameType, holeNumber, winnerId, details]
  );
  return result.rows[0];
}

export async function getSideGamesForRound(roundId: string) {
  const result = await pool.query(
    `SELECT sg.id, sg.game_type as "gameType", sg.hole_number as "holeNumber",
            sg.winner_id as "winnerId", u.username as "winnerName",
            sg.distance_or_details as "details", sg.created_at as "createdAt"
     FROM side_games sg
     JOIN users u ON sg.winner_id = u.id
     WHERE sg.round_id = $1
     ORDER BY sg.hole_number ASC`,
    [roundId]
  );
  return result.rows;
}

export async function getUserSideGameStats(userId: string) {
  const result = await pool.query(
    `SELECT 
       game_type as "gameType",
       COUNT(*) as "totalWins"
     FROM side_games
     WHERE winner_id = $1
     GROUP BY game_type`,
    [userId]
  );
  return result.rows;
}
