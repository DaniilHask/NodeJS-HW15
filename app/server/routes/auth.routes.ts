import { Router } from 'express';
import passport from 'passport';
import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));

router.get(
  '/user',
  passport.authenticate('jwt', { session: false }),
  (req, res) => authController.getProfile(req, res)
);

export default router;