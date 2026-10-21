import fileDB, { type NewsPost, type NewsInput } from '../fileDB.js';

export interface PaginationParams {
  page?: number;
  size?: number;
}

export class NewsportsRepository {
  async getAll(params: PaginationParams = { page: 0, size: 10 }) {
    const items = await fileDB.getItems();
    const page = params.page ?? 0;
    const size = params.size ?? 10;

    const startIndex = page * size;
    const endIndex = startIndex + size;

    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      data: paginatedItems,
      total: items.length,
      page,
      size,
    };
  }

  async getById(id: string): Promise<NewsPost | null> {
    return await fileDB.getItemById(id);
  }

  async create(data: { title: string; text: string }): Promise<NewsPost> {
    return await fileDB.addItem(data);
  }

  async update(id: string, update: NewsInput): Promise<NewsPost | null> {
    return await fileDB.updateItem(id, update);
  }

  async delete(id: string): Promise<boolean> {
    return await fileDB.deleteItem(id);
  }
}

export default new NewsportsRepository();