import bcrypt from 'bcrypt';
import { isDevelopment } from './app.utilities';

export const bcryptHashPassword = async (password: string, saltRounds: number = 10) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  if(isDevelopment){
    console.log('bcryptHashPassword', hashedPassword);
  }
  return hashedPassword;
};

export const bcryptComparePassword = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  if(isMatch){
    if(isDevelopment){
      console.log('bcryptComparePassword', 'Password matched');
    }
    return true;
  } else{
    if(isDevelopment){
      console.log('bcryptComparePassword', 'Invalid password');
    }
    return false;
  }
};
