import 'reflect-metadata';

import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import './config/passport.js';
import authRouter from './routes/auth.routes.js';
// @ts-ignore
import next from 'next';
import newsRoutes from './routes/news.routes.js';
import { requestLogger } from './middleware/logger.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { AppDataSource } from './data-source.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';

// @ts-expect-error next()
const app = next({ dev, dir: path.join(__dirname, '../client/client') });
const handle = app.getRequestHandler();

const PORT = Number(process.env.PORT) || 8000;

AppDataSource.initialize()
  .then(() => {
    console.log('Connected to PostgreSQL database successfully');
    return app.prepare();
  })
  .then(() => {
    const server = express();

    server.use(express.json());

    server.use(requestLogger);

    server.use('/auth', authRouter);
    server.use('/api', newsRoutes);

    server.all(/(.*)/, (req: Request, res: Response) => {
      return handle(req, res);
    });

    server.use(errorHandler);

    server.listen(PORT, () => {
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error during application initialization:', error);
    process.exit(1);
  });