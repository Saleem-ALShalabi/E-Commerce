import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CategoriesService } from './categories.service.js';

/**
 * ★ REFERENCE UNIT TEST ★
 * We replace PrismaService with a fake (mock) so tests run without a database.
 */
describe('CategoriesService', () => {
  let service: CategoriesService;

  const prismaMock = {
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $transaction: vi.fn((queries: Promise<unknown>[]) => Promise.all(queries)),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [CategoriesService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();
    service = moduleRef.get(CategoriesService);
  });

  it('returns a paginated list', async () => {
    const rows = [{ id: '1', name: 'Books', slug: 'books' }];
    prismaMock.category.findMany.mockResolvedValue(rows);
    prismaMock.category.count.mockResolvedValue(21);

    const query = Object.assign(new PaginationQueryDto(), { page: 2, limit: 10 });
    const result = await service.findAll(query);

    expect(prismaMock.category.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 10 }),
    );
    expect(result).toEqual({ data: rows, meta: { page: 2, limit: 10, total: 21, totalPages: 3 } });
  });

  it('returns a category by slug', async () => {
    const category = { id: '1', name: 'Books', slug: 'books' };
    prismaMock.category.findUnique.mockResolvedValue(category);

    await expect(service.findBySlug('books')).resolves.toEqual(category);
  });

  it('throws NotFoundException for an unknown slug', async () => {
    prismaMock.category.findUnique.mockResolvedValue(null);

    await expect(service.findBySlug('nope')).rejects.toBeInstanceOf(NotFoundException);
  });
});
