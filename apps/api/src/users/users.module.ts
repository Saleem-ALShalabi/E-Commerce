import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';

@Module({
  // 👉 TASK (Dev B): add a UsersController with GET /api/users/me and PATCH /api/users/me
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
