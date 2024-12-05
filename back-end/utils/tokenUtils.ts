import jwt from 'jsonwebtoken';

interface payloadType {
  id: string,
  username: string
}

export const generateAccessToken = (payload: payloadType) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error('ACCESS_TOKEN_SECRET is not defined in the environment');
  }
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

export const generateRefreshToken = (payload: payloadType) => {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  if (!secret) {
    throw new Error('REFRESH_TOKEN_SECRET is not defined in the environment');
  }
  return jwt.sign(payload, secret);
};
