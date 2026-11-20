import { Injectable, NotFoundException } from '@nestjs/common';
import { paginate, PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

/**
 * ★ REFERENCE SERVICE ★
 * The service holds the business logic and talks to the database.
 * Controllers stay thin: they only read the request and call the service.
 */
@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    // Run both queries in one round trip.
    const [data, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        orderBy: { name: 'asc' },
        skip: query.skip,
        take: query.limit,
      }),
      this.prisma.category.count(),
    ]);
    return paginate(data, total, query);
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({ where: { slug } });
    if (!category) {
      throw new NotFoundException(`Category "${slug}" not found`);
    }
    return category;
  }

  create(dto: CreateCategoryDto) {
    // Duplicate name/slug -> Prisma P2002 -> 409 Conflict (see PrismaExceptionFilter)
    return this.prisma.category.create({ data: dto });
  }

  update(id: string, dto: UpdateCategoryDto) {
    // Unknown id -> Prisma P2025 -> 404 Not Found
    return this.prisma.category.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.prisma.category.delete({ where: { id } });
  }
}
