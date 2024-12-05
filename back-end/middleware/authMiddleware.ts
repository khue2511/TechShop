import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined in the environment');
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = decoded; // Attaching user data to request
    next();
  });
}; 
