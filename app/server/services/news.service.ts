import newsRepository, { type PaginationParams } from '../repositories/news.repository.js';
import type { NewsPost, NewsInput } from '../fileDB.js';
import { NewspostsServiceError } from '../errors/errors.handler.js';

export class NewspostsService {
  async getAll(params: PaginationParams) {
    try {
      return await newsRepository.getAll(params);
    } catch (error) {
      if (error instanceof Error) throw new NewspostsServiceError(error.message);
      throw new NewspostsServiceError();
    }
  }

  async getById(id: number): Promise<NewsPost | null> {
    try {
      return await newsRepository.getById(id);
    } catch (error) {
      if (error instanceof Error) throw new NewspostsServiceError(error.message);
      throw new NewspostsServiceError();
    }
  }

  async create(data: Omit<NewsPost, 'id'>): Promise<NewsPost> {
    try {
      return await newsRepository.create(data);
    } catch (error) {
      if (error instanceof Error) throw new NewspostsServiceError(error.message);
      throw new NewspostsServiceError();
    }
  }

  async update(id: number, update: NewsInput): Promise<NewsPost | null> {
    try {
      return await newsRepository.update(id, update);
    } catch (error) {
      if (error instanceof Error) throw new NewspostsServiceError(error.message);
      throw new NewspostsServiceError();
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      return await newsRepository.delete(id);
    } catch (error) {
      if (error instanceof Error) throw new NewspostsServiceError(error.message);
      throw new NewspostsServiceError();
    }
  }

  async throwServiceError(): Promise<never> {
    throw new NewspostsServiceError('Demonstration of NewspostsServiceError');
  }
}

export default new NewspostsService();