import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto.js';

/** Same fields as Create, but all optional (for PATCH). */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
