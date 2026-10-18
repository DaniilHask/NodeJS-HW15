import { Router } from 'express';
import newsController from '../controllers/news.controller.js';

const router = Router();

router.get('/newsposts', (req, res) => newsController.getPosts(req, res));
router.get('/newsposts/:id', (req, res) => newsController.getPostById(req, res));
router.post('/newsposts', (req, res) => newsController.createPost(req, res));
router.put('/newsposts/:id', (req, res) => newsController.updatePost(req, res));
router.delete('/newsposts/:id', (req, res) => newsController.deletePost(req, res));

export default router;