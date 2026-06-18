import pool from '../db/connection';
import { Round, Score } from '../types';

export async function createRound(
  courseId: string,
  teeBoxId: string,
  scorekeeperId: string,
  holesPlayed: number = 18
): Promise<Round> {
  const result = await pool.query(
    `INSERT INTO rounds (course_id, tee_box_id, scorekeeper_id, holes_played, status)
     VALUES ($1, $2, $3, $4, 'in_progress')
     RETURNING id, course_id as "courseId", tee_box_id as "teeBoxId", 
               scorekeeper_id as "scorekeeperId", holes_played as "holesPlayed",
               status, created_at as "createdAt", completed_at as "completedAt"`,
    [courseId, teeBoxId, scorekeeperId, holesPlayed]
  );
  return result.rows[0];
}

export async function addParticipantToRound(
  roundId: string,
  userId: string,
  color?: string
) {
  const result = await pool.query(
    `INSERT INTO round_participants (round_id, user_id, color, status)
     VALUES ($1, $2, $3, 'confirmed')
     RETURNING id, round_id as "roundId", user_id as "userId", color, 
               status, created_at as "createdAt"`,
    [roundId, userId, color]
  );
  return result.rows[0];
}

export async function getRoundDetails(roundId: string) {
  const result = await pool.query(
    `SELECT r.id, r.course_id as "courseId", r.tee_box_id as "teeBoxId",
            r.scorekeeper_id as "scorekeeperId", r.holes_played as "holesPlayed",
            r.status, r.created_at as "createdAt", r.completed_at as "completedAt",
            c.name as "courseName", tb.name as "teeBoxName", tb.color as "teeBoxColor"
     FROM rounds r
     JOIN courses c ON r.course_id = c.id
     JOIN tee_boxes tb ON r.tee_box_id = tb.id
     WHERE r.id = $1`,
    [roundId]
  );
  return result.rows[0];
}

export async function getRoundParticipants(roundId: string) {
  const result = await pool.query(
    `SELECT rp.id, rp.user_id as "userId", u.username, u.first_name as "firstName",
            u.last_name as "lastName", rp.color, rp.status
     FROM round_participants rp
     JOIN users u ON rp.user_id = u.id
     WHERE rp.round_id = $1
     ORDER BY rp.created_at ASC`,
    [roundId]
  );
  return result.rows;
}

export async function getRoundHoles(teeBoxId: string, holesPlayed: number = 18) {
  const result = await pool.query(
    `SELECT id, hole_number as "holeNumber", par, yardage, handicap
     FROM holes
     WHERE tee_box_id = $1 AND hole_number <= $2
     ORDER BY hole_number ASC`,
    [teeBoxId, holesPlayed]
  );
  return result.rows;
}

export async function submitScore(
  roundId: string,
  holeId: string,
  userId: string,
  score: number
): Promise<Score> {
  const result = await pool.query(
    `INSERT INTO scores (round_id, hole_id, user_id, score)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (round_id, hole_id, user_id) DO UPDATE SET
       score = $4,
       updated_at = NOW()
     RETURNING id, round_id as "roundId", hole_id as "holeId", user_id as "userId",
               score, created_at as "createdAt", updated_at as "updatedAt"`,
    [roundId, holeId, userId, score]
  );
  return result.rows[0];
}

export async function getPlayerScores(roundId: string, userId: string) {
  const result = await pool.query(
    `SELECT s.id, s.hole_id as "holeId", h.hole_number as "holeNumber", h.par,
            s.score, h.yardage
     FROM scores s
     JOIN holes h ON s.hole_id = h.id
     WHERE s.round_id = $1 AND s.user_id = $2
     ORDER BY h.hole_number ASC`,
    [roundId, userId]
  );
  return result.rows;
}

export async function completeRound(roundId: string) {
  const result = await pool.query(
    `UPDATE rounds
     SET status = 'completed', completed_at = NOW()
     WHERE id = $1
     RETURNING id, status, completed_at as "completedAt"`,
    [roundId]
  );
  return result.rows[0];
}

export async function calculateRoundResults(roundId: string) {
  const participantsResult = await pool.query(
    `SELECT DISTINCT user_id as "userId" FROM round_participants WHERE round_id = $1`,
    [roundId]
  );

  const participants = participantsResult.rows.map((row: any) => row.userId);
  const scores: { [key: string]: number } = {};

  for (const userId of participants) {
    const scoresResult = await pool.query(
      `SELECT SUM(score) as total FROM scores WHERE round_id = $1 AND user_id = $2`,
      [roundId, userId]
    );
    scores[userId] = parseInt(scoresResult.rows[0]?.total || 0);
  }

  return scores;
}

export async function getUserRounds(userId: string, limit: number = 10) {
  const result = await pool.query(
    `SELECT r.id, r.course_id as "courseId", r.scorekeeper_id as "scorekeeperId",
            r.holes_played as "holesPlayed", r.status, r.created_at as "createdAt",
            r.completed_at as "completedAt", c.name as "courseName"
     FROM rounds r
     JOIN round_participants rp ON r.id = rp.round_id
     JOIN courses c ON r.course_id = c.id
     WHERE rp.user_id = $1
     ORDER BY r.created_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}
