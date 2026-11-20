import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module.js';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard.js';
import { RolesGuard } from './auth/guards/roles.guard.js';
import { CategoriesModule } from './categories/categories.module.js';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter.js';
import { HealthController } from './health/health.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env
    PrismaModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    // 👉 New feature modules (ProductsModule, CartModule, ...) are added here.
  ],
  controllers: [HealthController],
  providers: [
    // Every route requires a valid JWT unless it is marked with @Public().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Routes marked with @Roles('ADMIN') also check the user's role.
    { provide: APP_GUARD, useClass: RolesGuard },
    // Turns Prisma errors (unique violation, not found) into proper HTTP errors.
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
  ],
})
export class AppModule {}
