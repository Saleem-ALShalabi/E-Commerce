import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { Category } from '../../generated/prisma/client.js';

/** Response shape, used only so Swagger can document what the API returns. */
export class CategoryEntity implements Category {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() slug: string;
  @ApiPropertyOptional({ type: String, nullable: true }) description: string | null;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
}
