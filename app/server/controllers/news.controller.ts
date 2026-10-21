import type { Request, Response } from 'express';
import newsService from '../services/news.service.js';

export class NewsController {
  async getPosts(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page !== undefined ? Number(req.query.page) : 0;
      const size = req.query.size !== undefined ? Number(req.query.size) : 10;

      const result = await newsService.getAll({ page, size });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id as string;
      const post = await newsService.getById(postId);
      
      if (!post) {
        res.status(404).json({ error: 'News not found' });
        return;
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async createPost(req: Request, res: Response): Promise<void> {
    try {
      const { title, text } = req.body;
      if (!title || !text) {
        res.status(400).json({ error: 'Title and text are required' });
        return;
      }
      const newPost = await newsService.create({ title, text });
      res.status(201).json(newPost);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async updatePost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id as string;
      const updatedPost = await newsService.update(postId, req.body);
      
      if (!updatedPost) {
        res.status(404).json({ error: 'News not found' });
        return;
      }
      res.json(updatedPost);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  async deletePost(req: Request, res: Response): Promise<void> {
    try {
      const postId = req.params.id as string;
      const success = await newsService.delete(postId);
      
      if (!success) {
        res.status(404).json({ error: 'News not found' });
        return;
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default new NewsController();