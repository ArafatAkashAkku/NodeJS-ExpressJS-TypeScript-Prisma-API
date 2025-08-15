import CryptoJS from 'crypto-js';
import { randomBytes, randomInt } from 'crypto';
import { appCryptoSecretKey } from './app.utilities';

// Encrypt text
export const cryptoJsEncrypt = (text: string) => {
  const ciphertext = CryptoJS.AES.encrypt(text, appCryptoSecretKey).toString();
  return ciphertext;
};

// Decrypt text
export const cryptoJsDecrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, appCryptoSecretKey);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

// Secure token generator
export const generateToken = (length = 16): string => {
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
  return token.slice(0, length);
};

export const generateSecure4DigitToken = (): string => {
  // Ensure number is from 1000 to 9999 (so it never starts with 0)
  const num = randomInt(1000, 10000); // 1000–9999 inclusive
  return num.toString(); // always 4 digits, never starts with 0
};
