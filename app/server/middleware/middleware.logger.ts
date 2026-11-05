import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl,
    body: Object.keys(req.body).length > 0 ? req.body : undefined,
  });
  next();
}