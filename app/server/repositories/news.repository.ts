import { AppDataSource } from '../data-source.migrations.js';
import { Newspost } from '../entities/Newspost.js';
import type { User } from '../entities/User.js';

export interface PaginationParams {
  page?: number;
  size?: number;
}

export class NewsportsRepository {
  private repo = AppDataSource.getRepository(Newspost);

  async getAll(params: PaginationParams = { page: 0, size: 10 }) {
    const page = params.page ?? 0;
    const size = params.size ?? 10;
    const skip = page * size;

    const [items, total] = await this.repo.findAndCount({
      relations: { author: true },
      order: { createDate: 'DESC' },
      skip,
      take: size,
    });

    return {
      data: items,
      total,
      page,
      size,
    };
  }

  async getById(id: number): Promise<Newspost | null> {
    return await this.repo.findOne({
      where: { id },
      relations: { author: true },
    });
  }

  async create(data: Partial<Newspost>, user: User): Promise<Newspost> {
    const newPost = this.repo.create({
      ...data,
      author: user,
    });
    return await this.repo.save(newPost);
  }

  async update(id: number, update: Partial<Newspost>): Promise<Newspost | null> {
    const post = await this.getById(id);
    
    if (!post) return null;

    Object.assign(post, update);
    return await this.repo.save(post);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }
}

export default new NewsportsRepository();