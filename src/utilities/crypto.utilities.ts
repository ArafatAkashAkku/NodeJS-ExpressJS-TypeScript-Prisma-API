import CryptoJS from 'crypto-js';
import { randomBytes, randomInt } from 'crypto';
import { appCryptoSecretKey, isDevelopment } from './app.utilities';

// Encrypt text
export const cryptoJsEncrypt = (text: string) => {
  const ciphertext = CryptoJS.AES.encrypt(text, appCryptoSecretKey).toString();
  if(isDevelopment){
    console.log('cryptoJsEncrypt', ciphertext);
  }
  return ciphertext;
};

// Decrypt text
export const cryptoJsDecrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, appCryptoSecretKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  if(isDevelopment){
    console.log('cryptoJsDecrypt', originalText);
  }
  return originalText;
};

// Secure token generator
export const generateToken = (length: number = 16): string => {
  let token = '';
  while (token.length < length) {
    token += randomBytes(length)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '');
  }
  // Ensure first character is not '0'
  if (token[0] === '0') {
    for (let i = 0; i < token.length; i++) {
      if (token[i] !== '0') {
        token = token[i] + token.slice(1, length);
        break;
      }
    }
  }
  if(isDevelopment){
    console.log('generateToken', token.slice(0, length));
  }
  return token.slice(0, length);
};

export const generateSecure4DigitToken = (start: number = 1000, end: number = 9999): string => {
  const num = randomInt(start, end);
  if(isDevelopment){
    console.log('generateSecure4DigitToken', num.toString());
  }
  return num.toString();
};
