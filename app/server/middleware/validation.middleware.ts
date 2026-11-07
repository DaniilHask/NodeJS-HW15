import type { Request, Response, NextFunction } from 'express';
import Validator from 'fastest-validator';
import { ValidationError } from '../errors/errors.handler.js';

const v = new (Validator as any)();

const createSchema = {
  header: { type: 'string', max: 50, empty: false },
  text: { type: 'string', max: 256, empty: false },
  genre: { type: 'enum', values: ['Politic', 'Business', 'Sport', 'Other'] },
  isPrivate: { type: 'boolean' },
  createDate: { type: 'date', optional: true, convert: true },
  $$strict: true,
};

const updateSchema = {
  header: { type: 'string', max: 50, optional: true, empty: false },
  text: { type: 'string', max: 256, optional: true, empty: false },
  genre: { type: 'enum', values: ['Politic', 'Business', 'Sport', 'Other'], optional: true },
  isPrivate: { type: 'boolean', optional: true },
  createDate: { type: 'date', optional: true, convert: true },
  $$strict: true,
};

const checkCreate = v.compile(createSchema);
const checkUpdate = v.compile(updateSchema);

export function validateCreatePost(req: Request, _res: Response, next: NextFunction): void {
  const validationResult = checkCreate(req.body);

  if (validationResult !== true) {
    const errorMessages = Array.isArray(validationResult)
      ? validationResult.map((e: any) => `${e.field}: ${e.message}`).join(', ')
      : 'Validation failed';
    return next(new ValidationError(errorMessages));
  }

  next();
}

export function validateUpdatePost(req: Request, _res: Response, next: NextFunction): void {
  const validationResult = checkUpdate(req.body);

  if (validationResult !== true) {
    const errorMessages = Array.isArray(validationResult)
      ? validationResult.map((e: any) => `${e.field}: ${e.message}`).join(', ')
      : 'Validation failed';
    return next(new ValidationError(errorMessages));
  }

  next();
}