import fileDB from '../fileDB.js';
import type { NewsPost, NewsInput } from '../fileDB.js';

export class NewsService {
  async getAllPosts(): Promise<NewsPost[]> {
    return await fileDB.getItems();
  }

  async getPostById(id: string): Promise<NewsPost | null> {
    return await fileDB.getItemById(id);
  }

  async createPost(itemData: { title: string; text: string }): Promise<NewsPost> {
    return await fileDB.addItem(itemData);
  }

  async updatePost(id: string, updateData: NewsInput): Promise<NewsPost | null> {
    return await fileDB.updateItem(id, updateData);
  }

  async deletePost(id: string): Promise<boolean> {
    return await fileDB.deleteItem(id);
  }
}

export default new NewsService();