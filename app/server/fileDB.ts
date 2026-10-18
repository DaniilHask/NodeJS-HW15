import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface NewsPost {
  id: string;
  title: string;
  text: string;
  createdAt: string;
}

export type NewsInput = Partial<Omit<NewsPost, 'id' | 'createdAt'>>;

export class FileDB {
  private filepath: string;
  private data: NewsPost[] = [];
  private isInitialized = false;

  constructor(filename: string) {
    this.filepath = path.join(__dirname, 'data', filename);
  }

  private async init(): Promise<void> {
    try {
      const fileContent = await fs.readFile(this.filepath, 'utf-8');
      this.data = JSON.parse(fileContent);
    } catch {
      this.data = [];
      await this.save();
    }
    this.isInitialized = true;
  }

  private async save(): Promise<void> {
    await fs.writeFile(this.filepath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  async getItems(): Promise<NewsPost[]> {
    if (!this.isInitialized) await this.init();
    return this.data;
  }

  async getItemById(id: string): Promise<NewsPost | null> {
    if (!this.isInitialized) await this.init();
    return this.data.find(item => item.id === id) || null;
  }

  async addItem(itemData: { title: string; text: string }): Promise<NewsPost> {
    if (!this.isInitialized) await this.init();
    const newItem: NewsPost = {
      id: crypto.randomUUID(),
      title: itemData.title,
      text: itemData.text,
      createdAt: new Date().toISOString()
    };
    this.data.push(newItem);
    await this.save();
    return newItem;
  }

async updateItem(id: string, updateData: NewsInput): Promise<NewsPost | null> {
    if (!this.isInitialized) await this.init();
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;

    this.data[index] = {
      ...this.data[index],
      ...updateData,
      id
    } as NewsPost;
    
    await this.save();
    return this.data[index];
  }

  async deleteItem(id: string): Promise<boolean> {
    if (!this.isInitialized) await this.init();
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.data.splice(index, 1);
    await this.save();
    return true;
  }
}

const fileDB = new FileDB('news.json');
export default fileDB;