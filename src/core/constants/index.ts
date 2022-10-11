import { config } from 'dotenv';
import { HttpStatus } from '@nestjs/common';
import { E_API_STATUS_MESSAGE } from '../schemas';
config();

export const APP_NAME = 'Etap Wallet';
export const APP_DESCRIPTION = 'A REST API to mock a basic wallet system';
export const APP_VERSION = '1.0.0';
export const PASSWORD_HASH_SALT =
  parseInt(process.env.PASSWORD_HASH_SALT, 10) || 10;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';
export const JWT_SECRET = process.env.JWT_SECRET;

export const GET_STATUS_CODE = (code: number) => {
  // Success!
  if (code == HttpStatus.OK) {
    return E_API_STATUS_MESSAGE.ok;
  }

  if (code == HttpStatus.CREATED) {
    return E_API_STATUS_MESSAGE.created;
  }

  // Failed!
  if (code == HttpStatus.NOT_FOUND) {
    return E_API_STATUS_MESSAGE.failed;
  }

  if (code == HttpStatus.BAD_REQUEST) {
    return E_API_STATUS_MESSAGE.failed;
  }

  if (code == HttpStatus.UNPROCESSABLE_ENTITY) {
    return E_API_STATUS_MESSAGE.failed;
  }

  if (code == HttpStatus.UNAUTHORIZED) {
    return E_API_STATUS_MESSAGE.failed;
  }
};
