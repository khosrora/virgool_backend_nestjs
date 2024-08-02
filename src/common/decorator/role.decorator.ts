import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/common/enums/roles.enum';

export const ROLE_KEYS = 'ROLES';
export const CanAccess = (...roles: Roles[]) => SetMetadata(ROLE_KEYS, roles);
