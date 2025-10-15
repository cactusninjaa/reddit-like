import { Router } from 'express';
import { login, signup } from '../controllers/authUsersControllers.js'

const router = Router();

router.post('/signup', signup)

export default router