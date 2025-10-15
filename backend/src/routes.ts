import { Router } from 'express';
import authUsersRoutes from './routes/authUsersRoutes.js';

const router = Router();

router.use('/', (req, res) => {res.send('Hello World')})
router.use('/auth', authUsersRoutes);

export default router;