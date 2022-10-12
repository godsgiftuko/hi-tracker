import { SetMetadata } from '@nestjs/common';
import { E_USER_ROLE } from '../../core/schemas';

export const AllowedRoles = (...roles: E_USER_ROLE[]) =>
  SetMetadata('roles', roles);
