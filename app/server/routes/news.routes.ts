import { Router } from 'express';
import passport from 'passport';
import newsController from '../controllers/news.controller.js';
import { validateCreatePost, validateUpdatePost } from '../middleware/validation.middleware.js';

const router = Router();

router.get('/newsposts/error', (req, res, next) => newsController.triggerError(req, res, next));
router.get('/newsposts', (req, res, next) => newsController.getPosts(req, res, next));
router.get('/newsposts/:id', (req, res, next) => newsController.getPostById(req, res, next));

router.post(
  '/newsposts', 
  passport.authenticate('jwt', { session: false }), 
  validateCreatePost, 
  (req, res, next) => newsController.createPost(req, res, next)
);

router.put(
  '/newsposts/:id', 
  passport.authenticate('jwt', { session: false }), 
  validateUpdatePost, 
  (req, res, next) => newsController.updatePost(req, res, next)
);

router.delete(
  '/newsposts/:id', 
  passport.authenticate('jwt', { session: false }), 
  (req, res, next) => newsController.deletePost(req, res, next)
);

export default router;