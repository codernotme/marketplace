import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');
  
  // Create test Category
  const category = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Gadgets and gizmos',
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    },
  });

  const categoryClothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Apparel and accessories',
      imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
    },
  });

  // Create test Product
  const product = await prisma.product.upsert({
    where: { slug: 'loose-fit-hoodie' },
    update: {},
    create: {
      categoryId: categoryClothing.id,
      name: 'Loose Fit Hoodie',
      slug: 'loose-fit-hoodie',
      description: 'Comfortable and stylish loose fit hoodie.',
      status: 'active',
      featuredImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
      variants: {
        create: [
          {
            sku: 'HOODIE-BEIGE-M',
            title: 'Beige / M',
            price: 65.00,
            optionValues: JSON.stringify({ color: 'Beige', size: 'M' }),
          },
          {
            sku: 'HOODIE-BEIGE-L',
            title: 'Beige / L',
            price: 65.00,
            optionValues: JSON.stringify({ color: 'Beige', size: 'L' }),
          }
        ]
      }
    },
  });

  const product2 = await prisma.product.upsert({
    where: { slug: 'wireless-headphones' },
    update: {},
    create: {
      categoryId: category.id,
      name: 'Wireless Noise Cancelling Headphones',
      slug: 'wireless-headphones',
      description: 'Industry leading noise cancellation.',
      status: 'active',
      featuredImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      variants: {
        create: [
          {
            sku: 'WH-1000XM4',
            title: 'Black',
            price: 299.99,
          }
        ]
      }
    },
  });

  console.log('Seeding complete.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
