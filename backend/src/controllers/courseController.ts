import { Request, Response } from 'express';
import pool from '../db/connection';

export async function getCourses(req: Request, res: Response) {
  try {
    const result = await pool.query(
      `SELECT id, name, location, created_at as "createdAt"
       FROM courses
       ORDER BY name ASC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

export async function getCourseDetails(req: Request, res: Response) {
  try {
    const { courseId } = req.params;

    const courseResult = await pool.query(
      `SELECT id, name, location, created_at as "createdAt"
       FROM courses WHERE id = $1`,
      [courseId]
    );

    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const teeBoxesResult = await pool.query(
      `SELECT id, name, color, rating, slope
       FROM tee_boxes WHERE course_id = $1
       ORDER BY name ASC`,
      [courseId]
    );

    res.json({
      ...courseResult.rows[0],
      teeBoxes: teeBoxesResult.rows,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
}

export async function getTeeBoxHoles(req: Request, res: Response) {
  try {
    const { teeBoxId } = req.params;

    const result = await pool.query(
      `SELECT id, hole_number as "holeNumber", par, yardage, handicap
       FROM holes WHERE tee_box_id = $1
       ORDER BY hole_number ASC`,
      [teeBoxId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch holes' });
  }
}
