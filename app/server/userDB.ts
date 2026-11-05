import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface User {
  id: number;
  email: string;
  password: string;
  createDate: string;
}

export class UserDB {
  private filepath: string;
  private data: User[] = [];
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
        const numericIds = this.data.map(item => Number(item.id)).filter(id => !isNaN(id));
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

  async getUsers(): Promise<User[]> {
    if (!this.isInitialized) await this.init();
    return this.data;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    if (!this.isInitialized) await this.init();
    return this.data.find(user => user.email === email) || null;
  }

  async addUser(userData: Omit<User, 'id' | 'createDate'>): Promise<User> {
    if (!this.isInitialized) await this.init();
    const newUser: User = {
      id: this.idCounter++,
      email: userData.email,
      password: userData.password,
      createDate: new Date().toISOString()
    };
    this.data.push(newUser);
    await this.save();
    return newUser;
  }
}

const userDB = new UserDB('users.json');
export default userDB;