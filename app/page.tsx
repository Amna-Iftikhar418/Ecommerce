import type { Metadata } from "next";
import { db } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedDishesSection from "@/components/home/FeaturedDishesSection";
import StorySection from "@/components/home/StorySection";
import MenuCategoriesSection from "@/components/home/MenuCategoriesSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CtaSection from "@/components/home/CtaSection";

export const metadata: Metadata = {
  title: "Bella Cucina | Fresh Italian Food Delivered",
  description:
    "Order handcrafted Italian dishes online from Bella Cucina. Fresh pasta, wood-fired pizza, and more — delivered to your door in under 35 minutes.",
};

export default async function HomePage() {
  const [categories, featured] = await Promise.all([
    db.category.findMany({ orderBy: { order: "asc" } }),
    db.menuItem.findMany({
      where: { isAvailable: true, rating: { gte: 4.5 } },
      include: { category: true },
      orderBy: { rating: "desc" },
      take: 9,
    }),
  ]);

  const heroItem = featured[0] ?? null;
  const heroSecondaryItem = featured[8] ?? null;
  const storyItem = featured[1] ?? null;
  const gridItems = featured.slice(2, 8);

  return (
    <>
      <Navbar />
      <HeroSection
        featuredItem={
          heroItem
            ? { name: heroItem.name, image: heroItem.image, rating: heroItem.rating }
            : null
        }
        secondaryItem={
          heroSecondaryItem
            ? {
                name: heroSecondaryItem.name,
                image: heroSecondaryItem.image,
                rating: heroSecondaryItem.rating,
              }
            : null
        }
      />
      <FeaturedDishesSection
        items={gridItems.map((item) => ({
          id: item.id,
          slug: item.slug,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          rating: item.rating,
          categoryName: item.category.name,
          isAvailable: item.isAvailable,
        }))}
      />
      <StorySection visualImage={storyItem?.image ?? null} />
      <MenuCategoriesSection categories={categories} />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </>
  );
}
