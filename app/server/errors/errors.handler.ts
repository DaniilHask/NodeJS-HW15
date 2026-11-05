export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NewspostsServiceError extends Error {
  constructor(message: string = 'Internal Newsposts Service Error') {
    super(message);
    this.name = 'NewspostsServiceError';
    Object.setPrototypeOf(this, NewspostsServiceError.prototype);
  }
}