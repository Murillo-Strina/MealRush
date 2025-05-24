import { Router } from "express";
import { Login, UpdatePassword, DeleteUser } from '../Controllers/loginController.js';
import { authenticateToken } from '../Middleware/authMiddleware.js';

const router = Router();

router.post('/login', Login);
router.put('/user/update', authenticateToken, UpdatePassword);
router.delete('/user/delete', authenticateToken, DeleteUser);

export default router;