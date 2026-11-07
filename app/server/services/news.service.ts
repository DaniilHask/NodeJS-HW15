import newsRepository, { type PaginationParams } from '../repositories/news.repository.js';
import type { Newspost } from '../entities/Newspost.js';
import type { User } from '../entities/User.js';
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

  async getById(id: number): Promise<Newspost | null> {
    try {
      return await newsRepository.getById(id);
    } catch (error) {
      if (error instanceof Error) throw new NewspostsServiceError(error.message);
      throw new NewspostsServiceError();
    }
  }

  async create(data: Partial<Newspost>, user: User): Promise<Newspost> {
    try {
      return await newsRepository.create(data, user);
    } catch (error) {
      if (error instanceof Error) throw new NewspostsServiceError(error.message);
      throw new NewspostsServiceError();
    }
  }

  async update(id: number, update: Partial<Newspost>): Promise<Newspost | null> {
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