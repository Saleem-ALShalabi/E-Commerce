/**
 * Seeds the database with demo data. Run with: pnpm db:seed
 * Safe to run many times (uses upsert).
 */
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';

try {
  process.loadEnvFile('.env');
} catch {
  // use real environment variables
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // Demo accounts for LOCAL DEVELOPMENT ONLY (documented in README.md).
  const passwordHash = await bcrypt.hash('Password123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@shop.local' },
    update: {},
    create: { email: 'admin@shop.local', name: 'Admin', passwordHash, role: 'ADMIN' },
  });
  await prisma.user.upsert({
    where: { email: 'customer@shop.local' },
    update: {},
    create: { email: 'customer@shop.local', name: 'Customer', passwordHash },
  });

  const categories = [
    { name: 'Electronics', slug: 'electronics', description: 'Phones, laptops and gadgets' },
    { name: 'Books', slug: 'books', description: 'Fiction, non-fiction and textbooks' },
    { name: 'Clothing', slug: 'clothing', description: 'T-shirts, jackets and more' },
  ];
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  const products = [
    {
      name: 'Wireless Headphones',
      slug: 'wireless-headphones',
      priceCents: 7999,
      stock: 25,
      category: 'electronics',
    },
    {
      name: 'Mechanical Keyboard',
      slug: 'mechanical-keyboard',
      priceCents: 12900,
      stock: 10,
      category: 'electronics',
    },
    {
      name: 'USB-C Charger 65W',
      slug: 'usb-c-charger-65w',
      priceCents: 3499,
      stock: 50,
      category: 'electronics',
    },
    { name: 'Clean Code', slug: 'clean-code', priceCents: 3999, stock: 15, category: 'books' },
    {
      name: 'The Pragmatic Programmer',
      slug: 'the-pragmatic-programmer',
      priceCents: 4499,
      stock: 12,
      category: 'books',
    },
    {
      name: 'Classic Hoodie',
      slug: 'classic-hoodie',
      priceCents: 5900,
      stock: 30,
      category: 'clothing',
    },
    {
      name: 'Cotton T-Shirt',
      slug: 'cotton-t-shirt',
      priceCents: 1999,
      stock: 100,
      category: 'clothing',
    },
  ];
  for (const { category, ...data } of products) {
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        description: `Demo description for ${data.name}.`,
        imageUrl: `https://picsum.photos/seed/${data.slug}/600/600`,
        category: { connect: { slug: category } },
      },
    });
  }

  console.log('Seed finished');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
