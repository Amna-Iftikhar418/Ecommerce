import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

async function main() {
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItemOption.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();

  const starters = await prisma.category.create({
    data: { name: "Starters", slug: "starters", order: 1 },
  });
  const pizzas = await prisma.category.create({
    data: { name: "Pizzas", slug: "pizzas", order: 2 },
  });
  const pastas = await prisma.category.create({
    data: { name: "Pastas", slug: "pastas", order: 3 },
  });
  const desserts = await prisma.category.create({
    data: { name: "Desserts", slug: "desserts", order: 4 },
  });
  const drinks = await prisma.category.create({
    data: { name: "Drinks", slug: "drinks", order: 5 },
  });

  // Starters
  await prisma.menuItem.createMany({
    data: [
      {
        name: "Garlic Bread",
        slug: "garlic-bread",
        description:
          "Crispy Italian bread toasted with garlic butter and fresh herbs. Served warm.",
        price: 5.99,
        rating: 4.5,
        categoryId: starters.id,
      },
      {
        name: "Bruschetta",
        slug: "bruschetta",
        description:
          "Grilled bread rubbed with garlic and topped with fresh tomatoes, basil, and olive oil.",
        price: 7.99,
        rating: 4.3,
        categoryId: starters.id,
      },
      {
        name: "Caesar Salad",
        slug: "caesar-salad",
        description:
          "Crisp romaine lettuce with creamy Caesar dressing, shaved parmesan, and homemade croutons.",
        price: 9.99,
        rating: 4.6,
        categoryId: starters.id,
      },
      {
        name: "Tomato Soup",
        slug: "tomato-soup",
        description:
          "Rich, velvety tomato bisque made from vine-ripened tomatoes. Served with a crusty bread roll.",
        price: 6.49,
        rating: 4.4,
        categoryId: starters.id,
      },
    ],
  });

  // Pizzas with size options
  const margherita = await prisma.menuItem.create({
    data: {
      name: "Margherita",
      slug: "margherita-pizza",
      description:
        "Classic pizza with San Marzano tomato sauce, fresh mozzarella, and basil. Simple and perfect.",
      price: 14.99,
      rating: 4.7,
      categoryId: pizzas.id,
    },
  });
  await prisma.menuItemOption.create({
    data: {
      menuItemId: margherita.id,
      name: "Size",
      choices: [
        { label: 'Small (8")', priceModifier: 0 },
        { label: 'Medium (12")', priceModifier: 3 },
        { label: 'Large (16")', priceModifier: 5 },
      ],
      priceModifier: 0,
    },
  });

  const pepperoni = await prisma.menuItem.create({
    data: {
      name: "Pepperoni",
      slug: "pepperoni-pizza",
      description:
        "Generous layers of pepperoni over tomato sauce and melted mozzarella cheese.",
      price: 16.99,
      rating: 4.8,
      categoryId: pizzas.id,
    },
  });
  await prisma.menuItemOption.create({
    data: {
      menuItemId: pepperoni.id,
      name: "Size",
      choices: [
        { label: 'Small (8")', priceModifier: 0 },
        { label: 'Medium (12")', priceModifier: 3 },
        { label: 'Large (16")', priceModifier: 5 },
      ],
      priceModifier: 0,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        name: "BBQ Chicken",
        slug: "bbq-chicken-pizza",
        description:
          "Smoky BBQ sauce with grilled chicken, red onion, and mozzarella. A crowd favourite.",
        price: 17.99,
        rating: 4.5,
        categoryId: pizzas.id,
      },
      {
        name: "Veggie Supreme",
        slug: "veggie-supreme-pizza",
        description:
          "Loaded with bell peppers, mushrooms, olives, spinach, and sun-dried tomatoes.",
        price: 15.99,
        rating: 4.4,
        categoryId: pizzas.id,
      },
    ],
  });

  // Pastas
  await prisma.menuItem.createMany({
    data: [
      {
        name: "Spaghetti Bolognese",
        slug: "spaghetti-bolognese",
        description:
          "Al dente spaghetti with a slow-cooked beef and pork ragù. A timeless Italian classic.",
        price: 13.99,
        rating: 4.6,
        categoryId: pastas.id,
      },
      {
        name: "Fettuccine Alfredo",
        slug: "fettuccine-alfredo",
        description:
          "Silky fettuccine in a rich parmesan cream sauce. Comforting and indulgent.",
        price: 12.99,
        rating: 4.5,
        categoryId: pastas.id,
      },
      {
        name: "Penne Arrabbiata",
        slug: "penne-arrabbiata",
        description:
          "Penne pasta in a spicy San Marzano tomato sauce with garlic and chilli flakes.",
        price: 11.99,
        rating: 4.3,
        categoryId: pastas.id,
      },
      {
        name: "Mushroom Risotto",
        slug: "mushroom-risotto",
        description:
          "Creamy Arborio rice with wild mushrooms, white wine, and truffle oil. Vegetarian.",
        price: 14.99,
        rating: 4.7,
        categoryId: pastas.id,
      },
    ],
  });

  // Desserts
  await prisma.menuItem.createMany({
    data: [
      {
        name: "Tiramisu",
        slug: "tiramisu",
        description:
          "Classic Italian dessert with layers of espresso-soaked ladyfingers and mascarpone cream.",
        price: 7.99,
        rating: 4.9,
        categoryId: desserts.id,
      },
      {
        name: "Panna Cotta",
        slug: "panna-cotta",
        description:
          "Silky vanilla bean panna cotta served with a fresh berry coulis.",
        price: 6.99,
        rating: 4.7,
        categoryId: desserts.id,
      },
      {
        name: "Chocolate Lava Cake",
        slug: "chocolate-lava-cake",
        description:
          "Warm chocolate cake with a molten centre, served with a scoop of vanilla gelato.",
        price: 8.99,
        rating: 4.8,
        categoryId: desserts.id,
      },
    ],
  });

  // Drinks with flavour options
  const softDrink = await prisma.menuItem.create({
    data: {
      name: "Soft Drink",
      slug: "soft-drink",
      description: "Your choice of chilled soft drink. Served over ice.",
      price: 2.99,
      rating: 4.0,
      categoryId: drinks.id,
    },
  });
  await prisma.menuItemOption.create({
    data: {
      menuItemId: softDrink.id,
      name: "Flavour",
      choices: [
        { label: "Coca-Cola", priceModifier: 0 },
        { label: "Sprite", priceModifier: 0 },
        { label: "Fanta", priceModifier: 0 },
        { label: "Diet Coke", priceModifier: 0 },
      ],
      priceModifier: 0,
    },
  });

  const freshJuice = await prisma.menuItem.create({
    data: {
      name: "Fresh Juice",
      slug: "fresh-juice",
      description: "Freshly squeezed fruit juice, prepared to order.",
      price: 4.99,
      rating: 4.5,
      categoryId: drinks.id,
    },
  });
  await prisma.menuItemOption.create({
    data: {
      menuItemId: freshJuice.id,
      name: "Fruit",
      choices: [
        { label: "Orange", priceModifier: 0 },
        { label: "Apple", priceModifier: 0 },
        { label: "Mango", priceModifier: 0.5 },
        { label: "Watermelon", priceModifier: 0.5 },
      ],
      priceModifier: 0,
    },
  });

  await prisma.menuItem.createMany({
    data: [
      {
        name: "Espresso",
        slug: "espresso",
        description:
          "Rich, intense Italian espresso. Perfect to finish your meal.",
        price: 2.99,
        rating: 4.6,
        categoryId: drinks.id,
      },
      {
        name: "Sparkling Water",
        slug: "sparkling-water",
        description: "San Pellegrino sparkling mineral water. 500ml bottle.",
        price: 2.49,
        rating: 4.2,
        categoryId: drinks.id,
      },
    ],
  });

  console.log("✅ Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
