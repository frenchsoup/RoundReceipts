import { Router } from 'express';
import * as courseController from '../controllers/courseController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, courseController.getCourses);
router.get('/:courseId', authenticateToken, courseController.getCourseDetails);
router.get('/:courseId/tee-boxes/:teeBoxId/holes', authenticateToken, courseController.getTeeBoxHoles);

export default router;
