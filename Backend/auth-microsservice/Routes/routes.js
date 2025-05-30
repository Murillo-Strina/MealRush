import { Router } from "express";
import { Login, ResetPassword, DeleteUser, Register } from '../Controllers/loginController.js';
import { authenticateToken } from '../Middleware/authMiddleware.js';

const router = Router();

router.post('/login', Login);
router.post('/register' ,authenticateToken, Register);
router.post('/user/reset', ResetPassword);
router.delete('/user/delete', authenticateToken, DeleteUser);


export default router;