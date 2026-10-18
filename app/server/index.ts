import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import next from 'next';
import newsRoutes from './routes/news.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';

// @ts-expect-error next()
const app = next({ dev, dir: path.join(__dirname, '../client/client') });
const handle = app.getRequestHandler();

const PORT = Number(process.env.PORT) || 8000;

app.prepare().then(() => {
  const server = express();

  server.use(express.json());

  server.use('/api', newsRoutes);

 server.all(/(.*)/, (req: Request, res: Response) => {
  return handle(req, res);
});

  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});