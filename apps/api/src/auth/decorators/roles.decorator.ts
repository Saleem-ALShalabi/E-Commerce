import { SetMetadata } from '@nestjs/common';
import type { Role } from '../../generated/prisma/client.js';

export const ROLES_KEY = 'roles';

/** Restricts a route to users with one of the given roles, e.g. @Roles('ADMIN'). */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
