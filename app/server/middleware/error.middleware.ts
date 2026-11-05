import type { Request, Response, NextFunction } from 'express';
import { ValidationError, NewspostsServiceError } from '../errors/errors.handler.js';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ValidationError) {
    logger.warn(`ValidationError: ${err.message}`);
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof NewspostsServiceError) {
    logger.error(`NewspostsServiceError: ${err.message}`, { stack: err.stack });
    res.status(500).json({ error: err.message });
    return;
  }

  logger.error(`Unhandled Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
}