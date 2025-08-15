import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { appJwtExpiration, appJwtSecret } from './app.utilities';

// Generate JWT
export const generateJWT = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: appJwtExpiration as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, appJwtSecret, options);
};

// Verify JWT
export const verifyJWT = (token: string): JwtPayload | string => {
  return jwt.verify(token, appJwtSecret);
};
