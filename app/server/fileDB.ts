import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface NewsPost {
  id: number;
  title: string;
  text: string;
  genre: 'Politic' | 'Business' | 'Sport' | 'Other';
  isPrivate: boolean;
  createDate: string;
}

export type NewsInput = Partial<Omit<NewsPost, 'id'>>;

export class FileDB {
  private filepath: string;
  private data: NewsPost[] = [];
  private idCounter = 1;
  private isInitialized = false;

  constructor(filename: string) {
    this.filepath = path.join(__dirname, 'data', filename);
  }

  private async init(): Promise<void> {
    try {
      const fileContent = await fs.readFile(this.filepath, 'utf-8');
      this.data = JSON.parse(fileContent);
      if (this.data.length > 0) {
        const numericIds = this.data
          .map(item => Number(item.id))
          .filter(id => !isNaN(id));
        this.idCounter = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;
      }
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

  async getItemById(id: number): Promise<NewsPost | null> {
    if (!this.isInitialized) await this.init();
    return this.data.find(item => item.id === id) || null;
  }

  async addItem(itemData: Omit<NewsPost, 'id'>): Promise<NewsPost> {
    if (!this.isInitialized) await this.init();
    const newItem: NewsPost = {
      id: this.idCounter++,
      title: itemData.title,
      text: itemData.text,
      genre: itemData.genre,
      isPrivate: itemData.isPrivate,
      createDate: itemData.createDate ? new Date(itemData.createDate).toISOString() : new Date().toISOString()
    };
    this.data.push(newItem);
    await this.save();
    return newItem;
  }

  async updateItem(id: number, updateData: NewsInput): Promise<NewsPost | null> {
    if (!this.isInitialized) await this.init();
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;

    const currentItem = this.data[index];
    if (!currentItem) return null;

    const updatedDate = updateData.createDate 
      ? new Date(updateData.createDate).toISOString() 
      : currentItem.createDate;

    this.data[index] = {
      ...currentItem,
      ...updateData,
      id,
      createDate: updatedDate
    } as NewsPost;
    
    await this.save();
    return this.data[index] ?? null;
  }

  async deleteItem(id: number): Promise<boolean> {
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