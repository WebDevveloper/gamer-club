import 'express';

declare module 'express' {
  export interface Request {
    user?: {
      userId: number;
      role: 'user' | 'admin';
    };
  }
}