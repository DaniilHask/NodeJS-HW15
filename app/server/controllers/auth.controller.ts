import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source.js';
import { User } from '../entities/User.js';
import { JWT_SECRET } from '../config/passport.js';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, confirmPassword } = req.body;

      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      if (!password || password.length < 3) {
        return res.status(400).json({ error: 'Password must be at least 3 characters long' });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      const userRepository = AppDataSource.getRepository(User);

      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = userRepository.create({
        email,
        password: hashedPassword,
      });

      await userRepository.save(newUser);

      const tokenPayload = { email };
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({ token: `Bearer ${token}` });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOne({ where: { email } });
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const tokenPayload = { email: user.email };
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '7d' });

      return res.json({ token: `Bearer ${token}` });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getProfile(req: Request, res: Response) {
    const user = req.user as any;
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    return res.json({
      id: user.id,
      email: user.email,
    });
  }
}

export default new AuthController();