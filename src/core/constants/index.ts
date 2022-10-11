import { E_API_STATUS_CODE, E_API_STATUS_MESSAGE } from '../schemas';
import { config } from 'dotenv';
config();

export const APP_NAME = 'Etap Wallet';
export const APP_DESCRIPTION = 'A REST API to mock a basic wallet system';
export const APP_VERSION = '1.0.0';
export const PASSWORD_HASH_SALT =
  parseInt(process.env.PASSWORD_HASH_SALT, 10) || 10;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1m';

export const GET_STATUS_CODE = (code: number) => {
  // Success!
  if (code == E_API_STATUS_CODE.ok) {
    return E_API_STATUS_MESSAGE.ok;
  }

  if (code == E_API_STATUS_CODE.created) {
    return E_API_STATUS_MESSAGE.created;
  }

  // Failed!
  if (code == E_API_STATUS_CODE.notFound) {
    return E_API_STATUS_MESSAGE.failed;
  }

  if (code == E_API_STATUS_CODE.badRequest) {
    return E_API_STATUS_MESSAGE.failed;
  }

  if (code == E_API_STATUS_CODE.unProcessableEntity) {
    return E_API_STATUS_MESSAGE.failed;
  }

  if (code == E_API_STATUS_CODE.unAuthorized) {
    return E_API_STATUS_MESSAGE.failed;
  }
};
