import jwt from 'jsonwebtoken';

export const generateAccessToken = (username: string) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in the environment');
  }
  return jwt.sign(username, secret);
};

export const generateRefreshToken = (username: string) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined in the environment');
  }
  return jwt.sign(username, secret);
};
