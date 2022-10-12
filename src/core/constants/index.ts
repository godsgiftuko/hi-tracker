import { config } from 'dotenv';
config();

export const APP_NAME = 'Etap Wallet';
export const APP_DESCRIPTION = 'A REST API to mock a basic wallet system';
export const APP_VERSION = '1.0.0';
export const PASSWORD_HASH_SALT =
  parseInt(process.env.PASSWORD_HASH_SALT, 10) || 10;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
export const JWT_SECRET = process.env.JWT_SECRET;
