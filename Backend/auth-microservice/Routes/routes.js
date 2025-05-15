import { Router } from "express";
import { Login, Register, Update } from '../Controllers/loginController';

const router = Router();

router.post('/user/login', Login);
router.post('/user/register', Register);
router.put('/user/update', Update);

export default router;