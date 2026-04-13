import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function createTestUser() {
  const hashedPassword = await bcrypt.hash("testpassword123", 10);

  const user = await prisma.user.upsert({
    where: { email: "test@postforge.dev" },
    create: {
      email: "test@postforge.dev",
      password: hashedPassword,
      emailVerified: new Date(),
    },
    update: {},
  });

  console.log("Test user created:", user.email);
  await prisma.$disconnect();
}

createTestUser();
