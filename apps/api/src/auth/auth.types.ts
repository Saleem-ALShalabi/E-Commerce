import type { Role } from '../generated/prisma/client.js';

/** What we store inside the JWT. `sub` (subject) is the user id. */
export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
