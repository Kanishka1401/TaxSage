/**
 * Encryption utilities for secure data transmission
 * Used for encrypting sensitive tax data before sending to backend
 */

import CryptoJS from 'crypto-js';

// Encryption key - should be stored in environment variables in production
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'your-secret-key-replace-in-production';

/**
 * Encrypt data using AES encryption
 * @param {string|object} data - Data to encrypt
 * @returns {Promise<string>} Encrypted data as base64 string
 */
export const encryptData = async (data) => {
  try {
    // Convert object to string if necessary
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Encrypt using AES
    const encrypted = CryptoJS.AES.encrypt(dataString, ENCRYPTION_KEY).toString();
    
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt data using AES decryption
 * @param {string} encryptedData - Encrypted data as base64 string
 * @returns {Promise<string>} Decrypted data
 */
export const decryptData = async (encryptedData) => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    
    return decryptedString;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash sensitive data (one-way)
 * @param {string} data - Data to hash
 * @returns {string} Hashed data
 */
export const hashData = (data) => {
  return CryptoJS.SHA256(data).toString();
};

/**
 * Generate a secure random token
 * @param {number} length - Token length
 * @returns {string} Random token
 */
export const generateSecureToken = (length = 32) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export default {
  encryptData,
  decryptData,
  hashData,
  generateSecureToken
};