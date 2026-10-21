import newsRepository, { type PaginationParams } from '../repositories/news.repository.js';
import type { NewsPost, NewsInput } from '../fileDB.js';

export class NewspostsService {
  async getAll(params: PaginationParams) {
    return await newsRepository.getAll(params);
  }

  async getById(id: string): Promise<NewsPost | null> {
    return await newsRepository.getById(id);
  }

  async create(data: { title: string; text: string }): Promise<NewsPost> {
    return await newsRepository.create(data);
  }

  async update(id: string, update: NewsInput): Promise<NewsPost | null> {
    return await newsRepository.update(id, update);
  }

  async delete(id: string): Promise<boolean> {
    return await newsRepository.delete(id);
  }
}

export default new NewspostsService();