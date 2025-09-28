import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { appJwtExpiration, appJwtSecret, isDevelopment } from './app.utilities';

// Generate JWT
export const generateJWT = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: appJwtExpiration as SignOptions['expiresIn'],
  };
  const token = jwt.sign(payload, appJwtSecret, options);
  if(isDevelopment){
    console.log('generateJWT', token);
  }

  return token;
};

// Verify JWT
export const verifyJWT = (token: string): JwtPayload | string => {
  const decoded = jwt.verify(token, appJwtSecret);
  if(isDevelopment){
    console.log('verifyJWT', decoded);
  }
  return decoded;
};
