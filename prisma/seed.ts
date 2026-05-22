// prisma/seed.ts
import { prisma } from '../src/lib/prisma';

// We use 'as any' here specifically for the seed script to bypass
// the strict "known properties" check during the Next.js build phase.

const sampleProducts = [
  {
    title: 'Minimalist Ceramic Coffee Mug',
    description:
      'A beautifully handcrafted matte ceramic mug. Features an ergonomic handle and holds up to 12oz of your favorite morning brew. Dishwasher and microwave safe.',
    price: 24.99,
    salePrice: 19.99,
    stockQuantity: 45,
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600',
    ],
    isFeatured: true,
  },
  {
    title: 'Ergonomic Memory Foam Office Cushion',
    description:
      'Premium high-density memory foam cushion designed to support your lower back and improve posture during long hours at your desk.',
    price: 39.99,
    salePrice: null,
    stockQuantity: 120,
    category: 'Home & Kitchen',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600',
    ],
    isFeatured: false,
  },
  {
    title: 'AeroPulse Wireless Earbuds',
    description:
      'Immersive sound with active noise cancellation, Bluetooth 5.2 connectivity, and an ultra-lightweight charging case yielding up to 30 hours of playback.',
    price: 89.99,
    salePrice: 69.99,
    stockQuantity: 15,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600',
    ],
    isFeatured: true,
  },
  {
    title: 'Titanium Mechanical Gaming Keyboard',
    description:
      'Tactile mechanical blue-switches with custom RGB backlit arrays, modular layout, and an aircraft-grade brushed aluminum frame.',
    price: 129.99,
    salePrice: null,
    stockQuantity: 30,
    category: 'Electronics',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=600',
    ],
    isFeatured: false,
  },
  {
    title: 'FlexFit Non-Slip Yoga Mat',
    description:
      'Eco-friendly, dual-textured high-density TPE material providing excellent cushioning and joint support for rigorous exercise routines.',
    price: 34.5,
    salePrice: null,
    stockQuantity: 60,
    category: 'Fitness',
    images: [
      'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=600',
    ],
    isFeatured: true,
  },
  {
    title: 'Adjustable Smart Dumbbell Set (Pair)',
    description:
      'All-in-one steel dial dumbbell set adjusting from 5 lbs up to 52.5 lbs instantly. Replaces an entire rack of heavy weights.',
    price: 299.99,
    salePrice: 249.99,
    stockQuantity: 8,
    category: 'Fitness',
    images: [
      'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?q=80&w=600',
    ],
    isFeatured: true,
  },
];

async function main() {
  console.log('🔄 Starting database seeding...');

  // Optional: Clear out existing products to prevent duplicates during testing cycles
  await prisma.product.deleteMany();
  console.log('🧹 Cleared old records from Product table.');

  for (const productData of sampleProducts) {
    const product = await prisma.product.create({
      data: {
        title: productData.title,
        description: productData.description,
        price: productData.price,
        salePrice: productData.salePrice,
        stockQuantity: productData.stockQuantity,
        category: productData.category,
        images: productData.images,
        isFeatured: productData.isFeatured,
      },
    });
    console.log(`✅ Created product: ${product.title}`);
  }

  console.log('🌱 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding process:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
