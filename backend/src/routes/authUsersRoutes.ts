import { Router } from 'express';
import { login, signup, logout } from '../controllers/authUsersControllers.js'
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/signup', signup)
router.post('/login', login)
router.post("/logout", authMiddleware, logout);


export default router