const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    const hashedPassword = await bcrypt.hash('testpassword123', 10);

    const user = await prisma.user.upsert({
      where: { email: 'test@postforge.dev' },
      create: {
        email: 'test@postforge.dev',
        password: hashedPassword,
        emailVerified: new Date(),
        name: 'Test User',
      },
      update: {},
    });

    console.log('✅ Test user created successfully!');
    console.log('Email:', user.email);
    console.log('Password: testpassword123');
    console.log('User ID:', user.id);
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();