import { Router } from "express";
import authController from '../Controllers/authController.js';
import { authenticateToken } from '../Middleware/authMiddleware.js';

const router = Router();

router.post('/login', authController.Login);
router.put('/user/update', authenticateToken, authController.UpdatePassword);
router.delete('/user/delete', authenticateToken, authController.DeleteUser);
router.post('/register', authController.RegisterUser);

export default router;