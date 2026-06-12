import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../app/generated/prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as never);

const UNSPLASH = "https://images.unsplash.com";
const img = (id: string) => `${UNSPLASH}/photo-${id}?q=80&w=1200&auto=format&fit=crop`;

const DISH_IMAGES: Record<string, string> = {
  "garlic-bread": img("1486887396153-fa416526c108"),
  bruschetta: img("1572695157366-5e585ab2b69f"),
  "caesar-salad": img("1550304943-4f24f54ddde9"),
  "tomato-soup": img("1547592166-23ac45744acd"),
  "margherita-pizza": img("1574071318508-1cdbab80d002"),
  "pepperoni-pizza": img("1534308983496-4fabb1a015ee"),
  "bbq-chicken-pizza": img("1565299624946-b28f40a0ae38"),
  "veggie-supreme-pizza": img("1571066811602-716837d681de"),
  "spaghetti-bolognese": img("1622973536968-3ead9e780960"),
  "fettuccine-alfredo": img("1645112411341-6c4fd023714a"),
  "penne-arrabbiata": img("1473093295043-cdd812d0e601"),
  "mushroom-risotto": img("1476124369491-e7addf5db371"),
  tiramisu: img("1571877227200-a0d98ea607e9"),
  "panna-cotta": img("1488477181946-6428a0291777"),
  "chocolate-lava-cake": img("1624353365286-3f8d62daad51"),
  "soft-drink": img("1554866585-cd94860890b7"),
  "fresh-juice": img("1600271886742-f049cd451bba"),
  espresso: img("1510707577719-ae7c14805e3a"),
  "sparkling-water": img("1564419320461-6870880221ad"),
};

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
        image: DISH_IMAGES["garlic-bread"],
        categoryId: starters.id,
      },
      {
        name: "Bruschetta",
        slug: "bruschetta",
        description:
          "Grilled bread rubbed with garlic and topped with fresh tomatoes, basil, and olive oil.",
        price: 7.99,
        rating: 4.3,
        image: DISH_IMAGES["bruschetta"],
        categoryId: starters.id,
      },
      {
        name: "Caesar Salad",
        slug: "caesar-salad",
        description:
          "Crisp romaine lettuce with creamy Caesar dressing, shaved parmesan, and homemade croutons.",
        price: 9.99,
        rating: 4.6,
        image: DISH_IMAGES["caesar-salad"],
        categoryId: starters.id,
      },
      {
        name: "Tomato Soup",
        slug: "tomato-soup",
        description:
          "Rich, velvety tomato bisque made from vine-ripened tomatoes. Served with a crusty bread roll.",
        price: 6.49,
        rating: 4.4,
        image: DISH_IMAGES["tomato-soup"],
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
      image: DISH_IMAGES["margherita-pizza"],
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
      image: DISH_IMAGES["pepperoni-pizza"],
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
        image: DISH_IMAGES["bbq-chicken-pizza"],
        categoryId: pizzas.id,
      },
      {
        name: "Veggie Supreme",
        slug: "veggie-supreme-pizza",
        description:
          "Loaded with bell peppers, mushrooms, olives, spinach, and sun-dried tomatoes.",
        price: 15.99,
        rating: 4.4,
        image: DISH_IMAGES["veggie-supreme-pizza"],
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
        image: DISH_IMAGES["spaghetti-bolognese"],
        categoryId: pastas.id,
      },
      {
        name: "Fettuccine Alfredo",
        slug: "fettuccine-alfredo",
        description:
          "Silky fettuccine in a rich parmesan cream sauce. Comforting and indulgent.",
        price: 12.99,
        rating: 4.5,
        image: DISH_IMAGES["fettuccine-alfredo"],
        categoryId: pastas.id,
      },
      {
        name: "Penne Arrabbiata",
        slug: "penne-arrabbiata",
        description:
          "Penne pasta in a spicy San Marzano tomato sauce with garlic and chilli flakes.",
        price: 11.99,
        rating: 4.3,
        image: DISH_IMAGES["penne-arrabbiata"],
        categoryId: pastas.id,
      },
      {
        name: "Mushroom Risotto",
        slug: "mushroom-risotto",
        description:
          "Creamy Arborio rice with wild mushrooms, white wine, and truffle oil. Vegetarian.",
        price: 14.99,
        rating: 4.7,
        image: DISH_IMAGES["mushroom-risotto"],
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
        image: DISH_IMAGES["tiramisu"],
        categoryId: desserts.id,
      },
      {
        name: "Panna Cotta",
        slug: "panna-cotta",
        description:
          "Silky vanilla bean panna cotta served with a fresh berry coulis.",
        price: 6.99,
        rating: 4.7,
        image: DISH_IMAGES["panna-cotta"],
        categoryId: desserts.id,
      },
      {
        name: "Chocolate Lava Cake",
        slug: "chocolate-lava-cake",
        description:
          "Warm chocolate cake with a molten centre, served with a scoop of vanilla gelato.",
        price: 8.99,
        rating: 4.8,
        image: DISH_IMAGES["chocolate-lava-cake"],
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
      image: DISH_IMAGES["soft-drink"],
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
      image: DISH_IMAGES["fresh-juice"],
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
        image: DISH_IMAGES["espresso"],
        categoryId: drinks.id,
      },
      {
        name: "Sparkling Water",
        slug: "sparkling-water",
        description: "San Pellegrino sparkling mineral water. 500ml bottle.",
        price: 2.49,
        rating: 4.2,
        image: DISH_IMAGES["sparkling-water"],
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
