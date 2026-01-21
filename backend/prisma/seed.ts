import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: `${process.env.DATABASE_URL ?? ""}`,
});

const prisma = new PrismaClient({ adapter });

const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

async function main() {
  console.log("🌱 Starting seed...");

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: "admin@financy.com",
    },
  });

  let adminUser = existingAdmin;
  if (!adminUser) {
    const hashedPassword = await hashPassword("admin123");
    adminUser = await prisma.user.create({
      data: {
        name: "Administrator",
        email: "admin@financy.com",
        password: hashedPassword,
      },
    });
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@financy.com");
    console.log("🔑 Password: admin123");
    console.log("👤 ID:", adminUser.id);
  } else {
    console.log("✅ Admin user already exists.");
  }

  const existingCategoriesCount = await prisma.category.count({
    where: { userId: adminUser.id },
  });
  if (existingCategoriesCount === 0) {
    await prisma.category.createMany({
      data: [
        {
          name: "Alimentação",
          description: "Restaurantes, delivery e refeições",
          icon: "utensils",
          color: "#3B82F6",
          userId: adminUser.id,
        },
        {
          name: "Entretenimento",
          description: "Cinema, jogos e lazer",
          icon: "gamepad",
          color: "#F472B6",
          userId: adminUser.id,
        },
        {
          name: "Investimento",
          description: "Aplicações e retornos financeiros",
          icon: "trending-up",
          color: "#10B981",
          userId: adminUser.id,
        },
        {
          name: "Mercado",
          description: "Compras de supermercado e mantimentos",
          icon: "shopping-cart",
          color: "#F59E0B",
          userId: adminUser.id,
        },
        {
          name: "Salário",
          description: "Renda mensal e bonificações",
          icon: "wallet",
          color: "#22C55E",
          userId: adminUser.id,
        },
        {
          name: "Saúde",
          description: "Medicamentos, consultas e exames",
          icon: "heart-pulse",
          color: "#EF4444",
          userId: adminUser.id,
        },
        {
          name: "Transporte",
          description: "Gasolina, transporte público e viagens",
          icon: "car",
          color: "#A78BFA",
          userId: adminUser.id,
        },
        {
          name: "Utilidades",
          description: "Energia, água, internet e telefone",
          icon: "tools",
          color: "#FBBF24",
          userId: adminUser.id,
        },
      ],
    });
    console.log("✅ Default categories created for admin user.");
  } else {
    console.log(
      "✅ Categories already exist for admin user. Skipping creation."
    );
  }

  console.log("✨ Seed completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error executing seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
