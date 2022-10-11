import { config } from 'dotenv';
config();

export const APP_NAME = 'Etaps Wallet';
export const APP_DESCRIPTION = 'Simple wallet API.';
export const APP_VERSION = '1.0.0';
export const PASSWORD_HASH_SALT =
  parseInt(process.env.PASSWORD_HASH_SALT, 10) || 10;
export const JWT_EXPIRES_IN = '7d';
