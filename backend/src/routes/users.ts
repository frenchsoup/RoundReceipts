import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/search', authenticateToken, userController.searchGolfers);
router.get('/:userId', authenticateToken, userController.getProfile);
router.post('/friend-request', authenticateToken, userController.sendFriendRequest);
router.put('/friend-request/:requestId/accept', authenticateToken, userController.acceptFriendRequest);
router.get('/:userId/friends', authenticateToken, userController.getFriends);
router.get('/:userId/pending-requests', authenticateToken, userController.getPendingRequests);

export default router;
