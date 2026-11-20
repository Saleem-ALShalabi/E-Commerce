import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

/**
 * DTO = Data Transfer Object: describes and VALIDATES the request body.
 * The global ValidationPipe rejects requests that don't match (400 Bad Request).
 */
export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'electronics', description: 'URL-friendly id (lowercase, dashes)' })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase letters, numbers and dashes (e.g. "home-garden")',
  })
  slug: string;

  @ApiPropertyOptional({ example: 'Phones, laptops and gadgets' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
