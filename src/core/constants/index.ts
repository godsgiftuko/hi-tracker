import { config } from 'dotenv';
config();

// General
export const APP_NAME = 'Etap Wallet';
export const APP_DESCRIPTION = 'A REST API to mock a basic wallet system';
export const APP_VERSION = '1.0.0';
export const PASSWORD_HASH_SALT =
  parseInt(process.env.PASSWORD_HASH_SALT, 10) || 10;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
export const JWT_SECRET = process.env.JWT_SECRET || 'etaps--secret--key';
export const ADMIN_PHONE = process.env.ADMIN_PHONE;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const AVAILABLE_COUNTRY_CODE = process.env.AVAILABLE_COUNTRY || 'NG';

// Wallet
export const TRANSFER_LIMIT =
  parseInt(process.env.TRANSFER_LIMIT, 10) || 1000000;
export const ALLOWED_CURRENCIES = ['NGN', 'USD', 'EUR'];

export const FORMAT_AMOUNT = (currency = 'NGN', symbol = 'ja-JP') =>
  new Intl.NumberFormat(symbol, { style: 'currency', currency });
