import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function requestLogger(req: Request, _res: Response, next: NextFunction): void {
  const hasBody = req.body && Object.keys(req.body).length > 0;

  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl || req.url,
    body: hasBody ? req.body : undefined,
  });

  next();
}