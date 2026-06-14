import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
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

// Pre-render the homepage and revalidate every 5 minutes, so the document
// is served instantly from cache instead of waiting on DB queries per request.
export const revalidate = 300;

export default async function HomePage() {
  const [categories, featured, settings] = await Promise.all([
    db.category.findMany({ orderBy: { order: "asc" } }),
    db.menuItem.findMany({
      where: { isAvailable: true, rating: { gte: 4.5 } },
      include: { category: true },
      orderBy: { rating: "desc" },
      take: 9,
    }),
    getSettings(),
  ]);

  const pricing = {
    deliveryFee: settings.deliveryFee,
    freeDeliveryThreshold: settings.freeDeliveryThreshold,
    taxRate: settings.taxRate,
  };

  const heroItem = featured[0] ?? null;
  const secondaryItems = featured
    .filter((item) => item.id !== heroItem?.id)
    .map((item) => ({ name: item.name, image: item.image, rating: item.rating }));
  const gridItems = featured.slice(2, 8);

  return (
    <>
      <Navbar pricing={pricing} />
      <HeroSection secondaryItems={secondaryItems} />
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
      <StorySection />
      <MenuCategoriesSection categories={categories} />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </>
  );
}
