import { Router } from 'express';
import * as roundController from '../controllers/roundController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, roundController.createRound);
router.get('/:roundId', authenticateToken, roundController.getRound);
router.post('/:roundId/participants', authenticateToken, roundController.addParticipants);
router.post('/:roundId/scores', authenticateToken, roundController.submitScore);
router.get('/:roundId/scores/:userId', authenticateToken, roundController.getPlayerScores);
router.post('/:roundId/complete', authenticateToken, roundController.completeRound);
router.post('/:roundId/ctp', authenticateToken, roundController.recordClosestToPin);
router.post('/:roundId/long-drive', authenticateToken, roundController.recordLongDrive);
router.get('/:roundId/side-games', authenticateToken, roundController.getSideGames);
router.get('/user/rounds', authenticateToken, roundController.getUserRounds);

export default router;
