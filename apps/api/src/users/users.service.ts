import { Injectable } from '@nestjs/common';
import type { Prisma, User } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

/** A user without secret fields – the only shape we ever send to the client. */
export type PublicUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data: { ...data, email: data.email.toLowerCase() } });
  }

  /** NEVER return a raw User from a controller – always pass it through this. */
  toPublic(user: User): PublicUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...rest } = user;
    return rest;
  }

  // 👉 TASK (Dev B): add updateProfile(id, dto) for PATCH /api/users/me
}
