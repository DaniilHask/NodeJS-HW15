import type { Request, Response, NextFunction } from 'express';
import newsService from '../services/news.service.js';
import type { User } from '../entities/User.js';

export class NewsController {
  async getPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page !== undefined ? Number(req.query.page) : 0;
      const size = req.query.size !== undefined ? Number(req.query.size) : 10;

      const result = await newsService.getAll({ page, size });
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getPostById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = Number(req.params.id);
      const post = await newsService.getById(postId);
      
      if (!post) {
        res.status(404).json({ error: 'News not found' });
        return;
      }
      res.json(post);
    } catch (error) {
      next(error);
    }
  }

  async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const currentUser = (req as any).user as User;

      if (!currentUser) {
        res.status(401).json({ error: 'Unauthorized: User not found in request' });
        return;
      }

      const newPost = await newsService.create(req.body, currentUser);
      res.status(201).json(newPost);
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = Number(req.params.id);
      const updatedPost = await newsService.update(postId, req.body);
      
      if (!updatedPost) {
        res.status(404).json({ error: 'News not found' });
        return;
      }
      res.json(updatedPost);
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = Number(req.params.id);
      const success = await newsService.delete(postId);
      
      if (!success) {
        res.status(404).json({ error: 'News not found' });
        return;
      }
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async triggerError(_req: Request, _res: Response, next: NextFunction): Promise<void> {
    try {
      await newsService.throwServiceError();
    } catch (error) {
      next(error);
    }
  }
}

export default new NewsController();