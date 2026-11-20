import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../auth.types.js';

/**
 * Gives you the logged-in user inside a controller method:
 *   @Get('me') me(@CurrentUser() user: JwtPayload) { return user.sub; }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload =>
    ctx.switchToHttp().getRequest<{ user: JwtPayload }>().user,
);
