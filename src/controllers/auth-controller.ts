import { NextFunction, Request, Response } from 'express';
import { findUser } from './users-db.js';

export const authController = (req: Request, res: Response, next: NextFunction): void => {
  const auth = req.header('Authorization');

  if (auth === undefined) {
    res.status(403).send({
      status: 'unauthorized',
      errors: ['Missing authorization header'],
    });
    return;
  }

  if (auth.startsWith('Basic ')) {
    const credentials = auth.slice(6);
    const colonIndex = credentials.indexOf(':');
    
    const email = credentials.slice(0, colonIndex);
    const password = credentials.slice(colonIndex + 1);
    console.log('credenc', email, password);

    const user = findUser(email);

    if (user === undefined || user.password !== password) {
      res.status(403).send({
        status: 'unauthorized',
        errors: ['Invalid email or password'],
      });
      return;
    }

    console.log(user);
    req.user = user;
    req.week = user.week;
    next();
    return;
  }

  res.status(403).send({
    status: 'unauthorized',
    errors: ['Unexpected authorization header format'],
  });
};
