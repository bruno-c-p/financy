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
          icon: "Utensils",
          color: "#cc3629",
          userId: adminUser.id,
        },
        {
          name: "Entretenimento",
          description: "Cinema, jogos e lazer",
          icon: "Ticket",
          color: "#e0621d",
          userId: adminUser.id,
        },
        {
          name: "Investimento",
          description: "Aplicações e retornos financeiros",
          icon: "PiggyBank",
          color: "#2f9e44",
          userId: adminUser.id,
        },
        {
          name: "Mercado",
          description: "Compras de supermercado e mantimentos",
          icon: "ShoppingCart",
          color: "#d99006",
          userId: adminUser.id,
        },
        {
          name: "Salário",
          description: "Renda mensal e bonificações",
          icon: "Wallet",
          color: "#2f9e44",
          userId: adminUser.id,
        },
        {
          name: "Saúde",
          description: "Medicamentos, consultas e exames",
          icon: "Heart",
          color: "#c9366e",
          userId: adminUser.id,
        },
        {
          name: "Transporte",
          description: "Gasolina, transporte público e viagens",
          icon: "Car",
          color: "#3b5bdb",
          userId: adminUser.id,
        },
        {
          name: "Utilidades",
          description: "Energia, água, internet e telefone",
          icon: "Receipt",
          color: "#d99006",
          userId: adminUser.id,
        },
      ],
    });
    console.log("✅ Default categories created for admin user.");
  } else {
    console.log(
      "✅ Categories already exist for admin user. Skipping creation.",
    );
  }

  const categories = await prisma.category.findMany({
    where: { userId: adminUser.id },
  });

  const categoryMap = categories.reduce(
    (acc, cat) => {
      acc[cat.name] = cat.id;
      return acc;
    },
    {} as Record<string, string>,
  );

  const existingTransactionsCount = await prisma.transaction.count({
    where: { userId: adminUser.id },
  });

  if (existingTransactionsCount === 0) {
    const now = new Date();
    const transactions = [];

    const createDate = (daysAgo: number) => {
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);
      return date;
    };

    transactions.push(
      {
        description: "Jantar no Restaurante",
        amount: 89.5,
        date: createDate(60),
        type: "EXPENSE",
        categoryId: categoryMap["Alimentação"],
        userId: adminUser.id,
      },
      {
        description: "Posto de Gasolina",
        amount: 100.0,
        date: createDate(59),
        type: "EXPENSE",
        categoryId: categoryMap["Transporte"],
        userId: adminUser.id,
      },
      {
        description: "Compras no Mercado",
        amount: 156.8,
        date: createDate(58),
        type: "EXPENSE",
        categoryId: categoryMap["Mercado"],
        userId: adminUser.id,
      },
      {
        description: "Retorno de Investimento",
        amount: 340.25,
        date: createDate(56),
        type: "INCOME",
        categoryId: categoryMap["Investimento"],
        userId: adminUser.id,
      },
      {
        description: "Aluguel",
        amount: 1700.0,
        date: createDate(56),
        type: "EXPENSE",
        categoryId: categoryMap["Utilidades"],
        userId: adminUser.id,
      },
      {
        description: "Freelance",
        amount: 2500.0,
        date: createDate(54),
        type: "INCOME",
        categoryId: categoryMap["Salário"],
        userId: adminUser.id,
      },
      {
        description: "Compras Jantar",
        amount: 150.0,
        date: createDate(52),
        type: "EXPENSE",
        categoryId: categoryMap["Mercado"],
        userId: adminUser.id,
      },
      {
        description: "Cinema",
        amount: 88.0,
        date: createDate(48),
        type: "EXPENSE",
        categoryId: categoryMap["Entretenimento"],
        userId: adminUser.id,
      },
    );

    transactions.push(
      {
        description: "Salário Mensal",
        amount: 5000.0,
        date: createDate(35),
        type: "INCOME",
        categoryId: categoryMap["Salário"],
        userId: adminUser.id,
      },
      {
        description: "Conta de Luz",
        amount: 180.5,
        date: createDate(34),
        type: "EXPENSE",
        categoryId: categoryMap["Utilidades"],
        userId: adminUser.id,
      },
      {
        description: "Internet",
        amount: 99.9,
        date: createDate(33),
        type: "EXPENSE",
        categoryId: categoryMap["Utilidades"],
        userId: adminUser.id,
      },
      {
        description: "Supermercado",
        amount: 320.75,
        date: createDate(32),
        type: "EXPENSE",
        categoryId: categoryMap["Mercado"],
        userId: adminUser.id,
      },
      {
        description: "Farmácia",
        amount: 125.3,
        date: createDate(30),
        type: "EXPENSE",
        categoryId: categoryMap["Saúde"],
        userId: adminUser.id,
      },
      {
        description: "Uber",
        amount: 45.8,
        date: createDate(28),
        type: "EXPENSE",
        categoryId: categoryMap["Transporte"],
        userId: adminUser.id,
      },
      {
        description: "Restaurante",
        amount: 156.0,
        date: createDate(26),
        type: "EXPENSE",
        categoryId: categoryMap["Alimentação"],
        userId: adminUser.id,
      },
      {
        description: "Netflix",
        amount: 55.9,
        date: createDate(25),
        type: "EXPENSE",
        categoryId: categoryMap["Entretenimento"],
        userId: adminUser.id,
      },
      {
        description: "Gasolina",
        amount: 220.0,
        date: createDate(23),
        type: "EXPENSE",
        categoryId: categoryMap["Transporte"],
        userId: adminUser.id,
      },
      {
        description: "Investimento em Ações",
        amount: 1000.0,
        date: createDate(20),
        type: "EXPENSE",
        categoryId: categoryMap["Investimento"],
        userId: adminUser.id,
      },
    );

    transactions.push(
      {
        description: "Salário Janeiro",
        amount: 5000.0,
        date: createDate(5),
        type: "INCOME",
        categoryId: categoryMap["Salário"],
        userId: adminUser.id,
      },
      {
        description: "Aluguel Janeiro",
        amount: 1700.0,
        date: createDate(4),
        type: "EXPENSE",
        categoryId: categoryMap["Utilidades"],
        userId: adminUser.id,
      },
      {
        description: "Mercado Semanal",
        amount: 280.4,
        date: createDate(3),
        type: "EXPENSE",
        categoryId: categoryMap["Mercado"],
        userId: adminUser.id,
      },
      {
        description: "Jantar Especial",
        amount: 198.5,
        date: createDate(2),
        type: "EXPENSE",
        categoryId: categoryMap["Alimentação"],
        userId: adminUser.id,
      },
      {
        description: "Consulta Médica",
        amount: 250.0,
        date: createDate(1),
        type: "EXPENSE",
        categoryId: categoryMap["Saúde"],
        userId: adminUser.id,
      },
      {
        description: "Combustível",
        amount: 180.0,
        date: new Date(),
        type: "EXPENSE",
        categoryId: categoryMap["Transporte"],
        userId: adminUser.id,
      },
    );

    await prisma.transaction.createMany({
      data: transactions,
    });

    console.log(
      `✅ Created ${transactions.length} mock transactions for admin user.`,
    );
  } else {
    console.log(
      "✅ Transactions already exist for admin user. Skipping creation.",
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
