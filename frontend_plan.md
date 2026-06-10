# Premium Home Page & Brand Redesign — Bella Cucina

## Context

The current home page (`app/page.tsx`) and shared chrome (`Navbar`, `Footer`, `MenuCard`, `CategoryFilter`) use a generic orange/white "food delivery template" look — neutral shadcn theme, Geist-only typography, no scroll animations, a single hero + category grid + top-picks layout.

The goal is to elevate this to a **luxury editorial restaurant brand** (Michelin-star aesthetic) using a new green/gold/cream palette, an editorial display serif paired with the existing sans body font, and purposeful element-based scroll/hover animations (Framer Motion). Per the user's decisions:

1. **Scope**: Home page (full rebuild, all 7 sections from the brief), global design tokens (colors/fonts/radius), and shared chrome (`Navbar`, `Footer`, `MenuCard`, `CategoryFilter`). Other pages are NOT restructured but inherit the new look automatically via shared theme tokens + shared components.
2. **Color rollout**: Replace shadcn's core CSS variable tokens sitewide (affects admin/cart/checkout too, via existing components — acceptable and desired).
3. **Animation**: Add `framer-motion`; build small reusable animation wrappers under `components/motion/`.

No reservation/booking feature exists — CTAs map only to real routes (`/menu`, `/about`, `/orders`).

---

## 1. Design Tokens — `app/globals.css`

Tailwind v4 uses an inline `@theme` block that already maps `--color-primary: var(--primary)` etc. **Only the variable VALUES inside `:root` and `.dark` need to change** — the `@theme inline` mapping block stays as-is. Also bump `--radius` for a softer "premium card" feel, and repoint `--font-heading`.

### `:root` (light/default)

| Token | New value | Notes |
|---|---|---|
| `--background` | `#F0E8DB` | Cream |
| `--foreground` | `#000000` | Black |
| `--card` | `#FAF6ED` | Slightly lighter cream than bg, so cards lift off the page |
| `--card-foreground` | `#000000` | |
| `--popover` / `--popover-foreground` | `#FAF6ED` / `#000000` | |
| `--primary` | `#294225` | Deep green |
| `--primary-foreground` | `#F5EFE2` | Warm cream-white (text/icons on green) |
| `--secondary` | `#E3E0D0` | Soft sage-cream |
| `--secondary-foreground` | `#294225` | |
| `--muted` | `#E6DFCE` | |
| `--muted-foreground` | `#6B6354` | Warm gray-brown for secondary text |
| `--accent` | `#F9A61C` | Gold |
| `--accent-foreground` | `#1A1206` | Near-black warm brown (text/icons on gold) |
| `--destructive` | `#DC2626` | Unchanged role (red-600) |
| `--border` / `--input` | `#DCD2BC` | Warm tan |
| `--ring` | `#F9A61C` | Gold focus ring |
| `--radius` | `0.75rem` | Up from 0.625rem |

### `.dark`

| Token | New value |
|---|---|
| `--background` | `#1B2A18` (deep green-black) |
| `--foreground` | `#F0E8DB` |
| `--card` / `--popover` | `#233022` |
| `--card-foreground` / `--popover-foreground` | `#F0E8DB` |
| `--primary` | `#F9A61C` (gold pops on dark) |
| `--primary-foreground` | `#1B2A18` |
| `--secondary` / `--muted` | `#2E3D2A` |
| `--secondary-foreground` | `#F0E8DB` |
| `--muted-foreground` | `#B7AE9A` |
| `--accent` | `#F0E8DB` (cream highlight) |
| `--accent-foreground` | `#1B2A18` |
| `--destructive` | `#F87171` |
| `--border` | `oklch(1 0 0 / 12%)` (keep alpha pattern, now over green bg) |
| `--input` | `oklch(1 0 0 / 15%)` |
| `--ring` | `#F9A61C` |

### Sidebar tokens (admin nav — derive from above, no new concepts)
`--sidebar` → `var(--card)`, `--sidebar-foreground` → `var(--card-foreground)`, `--sidebar-primary` → `var(--primary)`, `--sidebar-primary-foreground` → `var(--primary-foreground)`, `--sidebar-accent` → `var(--muted)`, `--sidebar-accent-foreground` → `var(--foreground)`, `--sidebar-border` → `var(--border)`, `--sidebar-ring` → `var(--ring)`. Same for both `:root` and `.dark`.

### Chart colors (optional, low-risk one-liner)
Replace `--chart-1..5` with a green→gold ramp: `#294225, #4A6741, #8FA876, #D88A12, #F9A61C`.

### Font wiring
Change `--font-heading: var(--font-sans)` → `--font-heading: var(--font-fraunces)` in the `@theme inline` block. `--font-sans` (Geist) stays the body font.

---

## 2. Fonts — `app/layout.tsx`

Add a second `next/font/google` loader for **Fraunces** (editorial variable serif, great "Michelin" character, pairs cleanly with Geist):

```ts
import { Fraunces } from "next/font/google";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
});
```

Add `${fraunces.variable}` to the `<html className={...}>` string alongside the existing `${geistSans.variable}`. Headings/display text use `font-heading` (Fraunces); body stays `font-sans` (Geist) — no changes needed to existing body text classes.

---

## 3. Dependency — `package.json`

Run `npm install framer-motion`. No other new dependencies (no embla-carousel — testimonials carousel built with CSS scroll-snap).

---

## 4. New Animation Primitives — `components/motion/`

All are small `"use client"` wrappers so the home page sections that use them can otherwise stay Server Components.

- **`FadeUp.tsx`** — `motion.div`, `initial={{opacity:0,y:24}}`, `whileInView={{opacity:1,y:0}}`, `viewport={{once:true, margin:"-80px"}}`, `transition={{duration:0.6, ease:[0.21,0.47,0.32,0.98], delay}}`. Props: `children`, `delay?`, `className?`.
- **`StaggerReveal.tsx`** — exports `StaggerContainer` (sets `variants`, `initial="hidden"`, `whileInView="visible"`, `viewport={{once:true}}`, `transition={{staggerChildren:0.12}}`) and `StaggerItem` (`hidden:{opacity:0,y:20}` → `visible:{opacity:1,y:0}`). Used to wrap grids (Featured Dishes, Menu Categories, Why Choose Us).
- **`MagneticButton.tsx`** — wraps a child (Link/Button) in `motion.div`, tracks `onMouseMove` offset within bounds, applies small `x/y` transform via `useMotionValue`+`useSpring` (clamped ~±8px), resets `onMouseLeave`. Props: `children`, `className?`, `strength?` (default small).
- **`ParallaxElement.tsx`** — `useScroll({target: ref, offset:["start end","end start"]})` + `useTransform` to translateY a decorative element by a small range (e.g. ±24px) scaled by a `speed` prop. Used for background blob shapes in Hero/Story sections only (no animated backgrounds — purely decorative foreground shapes).

---

## 5. New Home Section Components — `components/home/`

`app/page.tsx` becomes a thin Server Component that fetches data and composes these. Update the Prisma query:

```ts
const [categories, featured] = await Promise.all([
  db.category.findMany({ orderBy: { order: "asc" } }),
  db.menuItem.findMany({
    where: { isAvailable: true, rating: { gte: 4.5 } },
    include: { category: true },
    orderBy: { rating: "desc" },
    take: 8, // featured[0]=hero visual, featured[1]=story visual, rest=grid
  }),
]);

const heroItem = featured[0] ?? null;
const storyItem = featured[1] ?? null;
const gridItems = featured.slice(2, 8);
```
(If `featured` has fewer than 2 items, `storyItem`/`gridItems` gracefully become `null`/`[]` — every section below already handles empty/null gracefully.)

### `icon-maps.ts`
`getCategoryIcon(slug: string): LucideIcon` — maps known slugs to icons with a safe default:
`starters→Salad, pizzas→Pizza, pastas→ChefHat, desserts→IceCream, drinks→CupSoda`, default `UtensilsCrossed`.

### `HeroSection.tsx` (`"use client"` — motion + parallax)
Props: `{ featuredItem: { name: string; image: string|null; rating: number } | null }`.
- `<section className="relative min-h-screen bg-primary text-primary-foreground overflow-hidden">`, `grid lg:grid-cols-2` asymmetric layout, content padded to clear the fixed navbar (`pt-28`).
- Left: massive `font-heading text-7xl/8xl font-bold` "Bella Cucina" (one word in `text-accent`), italic `font-heading text-2xl text-accent` tagline, description paragraph, CTA row — primary "Explore Menu" → `/menu` (gold solid button) and secondary "Order Online" → `/menu` (outline cream button), both wrapped in `MagneticButton`.
- Right: layered visual card (`rounded-3xl shadow-2xl rotate-2 overflow-hidden aspect-[4/5]`) with `<Image fill>` of `featuredItem.image`; if `null`, gradient panel (`bg-accent/15`) with large centered `UtensilsCrossed`/`Sparkles` icon. Floating rating badge (`absolute -bottom-6 -left-6 bg-card text-card-foreground rounded-2xl shadow-xl p-4`, `FadeUp` delayed) showing `featuredItem.rating` + "Top Rated". Decorative gold blur-blob shapes wrapped in `ParallaxElement`.
- Small bouncing scroll-down chevron at bottom center (`animate-bounce`, pure CSS).

### `FeaturedDishesSection.tsx` (Server Component)
Props: `{ items: MenuCardProps[] }` (each includes `id`). `<section className="py-24 px-4 bg-background">`, header row (`font-heading text-4xl sm:text-5xl font-bold` "Featured Dishes" + "View Full Menu →" link to `/menu`), `StaggerContainer` > grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8` of `StaggerItem` > `MenuCard`. Render section only if `items.length > 0`.

### `StorySection.tsx` (Server Component)
Props: `{ visualImage: string | null }`. `<section className="py-24 px-4 bg-secondary/40">`, split `grid lg:grid-cols-2 gap-12 items-center`. Text side (`FadeUp`): `font-heading text-4xl sm:text-5xl font-bold` "Our Story", 2–3 sentence excerpt adapted from `app/(customer)/about/page.tsx` (Chef Marco Ricci, founded 2012, handmade pasta/San Marzano tomatoes), arrow link to `/about`. Visual side (`FadeUp` delayed + `ParallaxElement`): `rounded-3xl shadow-2xl aspect-[4/5] overflow-hidden` with `<Image fill>` if `visualImage`, else gradient + `ChefHat` icon fallback.

### `MenuCategoriesSection.tsx` (Server Component)
Props: `{ categories: { id; name; slug }[] }`. `<section className="py-24 px-4 bg-primary text-primary-foreground">`, centered `font-heading text-4xl sm:text-5xl font-bold` header "Explore Our Menu". `StaggerContainer` > grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6`; each category → `StaggerItem` > `Link` to `/menu?category={slug}` styled as large card (`bg-primary-foreground/5 hover:bg-accent hover:text-primary border border-primary-foreground/10 rounded-2xl p-8 flex flex-col items-center gap-4 transition-colors group`), icon from `getCategoryIcon(slug)` at `h-12 w-12` with `group-hover:scale-110`, name in `font-heading text-lg font-semibold`. Render only if `categories.length > 0`.

### `WhyChooseUsSection.tsx` (Server Component)
Static array of 5: Fresh Ingredients (`Sprout`), Expert Chefs (`ChefHat`), Fast Service (`Zap`), Premium Quality (`Gem`), Hygienic Kitchen (`ShieldCheck`) — each with a 1-sentence description. `<section className="py-24 px-4 bg-background">`, centered header, `StaggerContainer` > `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6` with alternating `lg:translate-y-8` on even cards for a "broken grid" feel. Each card: `bg-card rounded-2xl p-8 shadow-sm border border-border hover:shadow-xl hover:-translate-y-2 transition-all`, oversized icon in `h-16 w-16 rounded-full bg-accent/15 text-accent flex items-center justify-center mb-4`, `font-heading text-xl font-semibold` title, `text-muted-foreground text-sm` description.

### `TestimonialsSection.tsx` (`"use client"` — scroll container ref for prev/next)
Static array of 3–4 testimonials (`name`, `role`, `quote`, `rating: 5`). Avatars use existing `/components/ui/avatar.tsx` `Avatar`/`AvatarFallback` with initials (`bg-primary text-primary-foreground font-heading`) — no external photo URLs. `<section className="py-24 px-4 bg-secondary/40">`, header, horizontal `flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4` of cards (`min-w-[320px] sm:min-w-[400px] snap-center bg-card rounded-2xl p-8 shadow-md border border-border`) each with 5 gold `Star` icons, italic `font-heading text-lg` quote, Avatar + name/role row. Optional round prev/next buttons calling `scrollRef.current.scrollBy({left: ±420, behavior:"smooth"})`.

### `CtaSection.tsx` (Server Component + `MagneticButton` islands)
`<section className="py-24 px-4">` containing a large rounded panel (`bg-primary text-primary-foreground rounded-3xl mx-auto max-w-6xl p-12 sm:p-20 text-center relative overflow-hidden` with decorative gold blur shapes), `font-heading text-4xl sm:text-6xl font-bold` headline, subtext, button row: `MagneticButton`-wrapped "Explore Full Menu" → `/menu` (gold solid) and "About Us" → `/about` (outline cream).

---

## 6. `app/page.tsx` Rewrite

```tsx
export default async function HomePage() {
  const [categories, featured] = await Promise.all([...]); // as above

  return (
    <>
      <Navbar />
      <HeroSection featuredItem={heroItem} />
      <FeaturedDishesSection items={gridItems} />
      <StorySection visualImage={storyItem?.image ?? null} />
      <MenuCategoriesSection categories={categories} />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </>
  );
}
```
Update `metadata` description if desired (optional, low priority).

---

## 7. `components/Navbar.tsx` — Transparent-on-Home, Solid Elsewhere/On-Scroll

- Switch from `sticky top-0` to `fixed top-0 left-0 right-0 z-50` so it can overlay the full-bleed hero.
- Add `usePathname()` (next/navigation) and a scroll listener (`useState` + `useEffect`, threshold ~40px, cleanup on unmount).
- `const isHome = pathname === "/"`; `const transparent = isHome && !scrolled`.
- `className={cn("fixed top-0 inset-x-0 z-50 transition-colors duration-300", transparent ? "bg-transparent text-primary-foreground" : "bg-background/95 backdrop-blur border-b border-border text-foreground")}`.
- Logo: `font-heading font-bold`, icon color `text-accent` when transparent, adjust as needed for contrast in both states.
- Desktop links / CartSidebar icon / SignIn button: ensure visible in both states (use `currentColor`/`text-current` or conditional classes — the transparent state's `text-primary-foreground` makes default text classes inherit cream; non-transparent uses `text-foreground`).
- Mobile `Sheet` panel: restyle to `bg-card`, `font-heading` title, gold/green accents — keep all existing links/Clerk logic unchanged.

### `app/(customer)/layout.tsx` — 1-line companion change
Because Navbar is now `fixed` (out of flow), inner pages need top padding so content doesn't sit under it. Add `pt-16` to the children wrapper:
```tsx
<div className="flex-1 pt-16">{children}</div>
```
(Home page doesn't use this layout — `HeroSection`'s own `pt-28` handles its fixed-navbar clearance.)

---

## 8. `components/Footer.tsx` — Visual Redesign

Preserve all existing links/content (Menu, About, My Orders, My Account, address, phone, email, copyright). Apply new palette:
- `<footer className="bg-primary text-primary-foreground mt-auto">` (bold green footer band).
- Logo: `font-heading font-bold text-xl text-primary-foreground`, icon `text-accent`.
- Tagline: `text-primary-foreground/70`.
- Section headers ("Quick Links", "Contact"): `font-heading text-sm font-semibold mb-3 text-accent uppercase tracking-wider`.
- Links: `text-primary-foreground/70 hover:text-accent transition-colors`.
- Copyright bar: `border-t border-primary-foreground/10 mt-8 pt-6 text-center text-xs text-primary-foreground/50`.

---

## 9. Shared Component Updates

### `components/menu/MenuCard.tsx`
- Add new required prop `id: string` (the `MenuItem.id` / cuid, needed for cart).
- Replace `bg-orange-50` placeholder → `bg-muted`; emoji fallback `🍽️` → centered `UtensilsCrossed` icon (`h-12 w-12 text-muted-foreground/40`).
- Card root: add `rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300` (pure Tailwind, stays server-renderable).
- Title: `font-heading font-semibold text-base`.
- Price: `font-heading font-bold text-base text-primary` (was `text-orange-500`).
- Category badge: unchanged (`Badge variant="outline"` auto-inherits new tokens).
- Add a floating `QuickAddButton` over the image, bottom-right (`absolute bottom-3 right-3 z-10 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity`), only when `isAvailable`.

### `components/menu/QuickAddButton.tsx` (new, `"use client"`)
Props: `{ id, name, price, image, isAvailable, className? }`. On click (`preventDefault`/`stopPropagation` since the card is a `<Link>`), calls `useCartStore.getState().addItem({ menuItemId: id, name, price, image, quantity: 1, options: [] })` and shows `toast.success(`${name} added to cart`)` via `sonner`. Renders a round gold icon button (`bg-accent text-accent-foreground`) with a `Plus` icon. Returns `null` if `!isAvailable`.

### `components/menu/CategoryFilter.tsx`
Restyle only the className logic (routing logic unchanged):
```tsx
current === cat.slug
  ? "bg-primary text-primary-foreground border-primary"
  : "border-border bg-background text-muted-foreground hover:border-accent hover:text-foreground hover:bg-accent/10"
```

### `app/(customer)/menu/page.tsx`
One-line addition: pass `id={item.id}` to the existing `<MenuCard ... />` call (the query already selects full `MenuItem`, so `id` is available).

---

## 10. Verification

1. `npm install framer-motion`.
2. `npx tsc --noEmit` — confirms `id` prop propagation, `LucideIcon` typings in `icon-maps.ts`, motion component prop types.
3. `npm run lint`.
4. `npm run dev` and check:
   - `/` — all 7 sections render; hero/story fallback panels render correctly if `featured[].image` is `null` (verify against actual seed data — if all images are `null`, the fallback gradient+icon paths are what you'll see, so make sure those look intentional/polished too). Fade-up/stagger animations fire once on scroll. Navbar is transparent (cream text) over the green hero, becomes solid cream/black on scroll. Magnetic hover on hero & CTA buttons. Testimonials scroll-snap works via drag/touch and prev/next buttons.
   - `/menu` — `MenuCard` shows new styling, `QuickAddButton` appears on hover (always visible on mobile) and adds to cart with a toast; `CategoryFilter` shows new active/hover colors; `?category=` routing still works.
   - Open `CartSidebar` after a quick-add to confirm item shape (`menuItemId`, `name`, `price`, `image`, `quantity:1`, `options:[]`).
   - Spot-check `/about`, `/cart`, `/checkout`, `/orders`, `/account`, `/admin/*` — confirm new green/gold/cream tokens render sensibly through existing Buttons/Badges/Cards, and that the `fixed` Navbar + `pt-16` on `(customer)/layout.tsx` doesn't clip content.
   - Toggle dark mode (if reachable) to sanity-check `.dark` token contrast.
5. `npm run build` — confirm Fraunces font import resolves and client/server component boundaries (motion components) build cleanly.

---

## Task Checklist (implementation order)

- [ ] 1. Update `app/globals.css` color tokens (`:root`/`.dark`), `--radius: 0.75rem`, sidebar tokens, optional chart colors, repoint `--font-heading` to `--font-fraunces`.
- [ ] 2. Add Fraunces font in `app/layout.tsx` and wire `--font-fraunces` onto `<html>`.
- [ ] 3. `npm install framer-motion`.
- [ ] 4. Create `components/motion/FadeUp.tsx`, `StaggerReveal.tsx`, `MagneticButton.tsx`, `ParallaxElement.tsx`.
- [ ] 5. Create `components/home/icon-maps.ts` (`getCategoryIcon`).
- [ ] 6. Create `components/home/HeroSection.tsx`, `FeaturedDishesSection.tsx`, `StorySection.tsx`, `MenuCategoriesSection.tsx`, `WhyChooseUsSection.tsx`, `TestimonialsSection.tsx`, `CtaSection.tsx`.
- [ ] 7. Rewrite `app/page.tsx` (new Prisma query + section composition).
- [ ] 8. Update `components/Navbar.tsx` (fixed positioning, transparent-on-home/scroll, new palette/fonts).
- [ ] 9. Add `pt-16` to `app/(customer)/layout.tsx` content wrapper.
- [ ] 10. Redesign `components/Footer.tsx` with new palette, preserving all links.
- [ ] 11. Update `components/menu/MenuCard.tsx` (`id` prop + redesign), create `components/menu/QuickAddButton.tsx`, update `app/(customer)/menu/page.tsx` (`id={item.id}`).
- [ ] 12. Restyle `components/menu/CategoryFilter.tsx` active/hover classes.
- [ ] 13. Run verification checklist (`tsc --noEmit`, `lint`, `dev` visual pass, `build`).

---

## Files Touched

**New:**
- `components/motion/FadeUp.tsx`
- `components/motion/StaggerReveal.tsx`
- `components/motion/MagneticButton.tsx`
- `components/motion/ParallaxElement.tsx`
- `components/home/icon-maps.ts`
- `components/home/HeroSection.tsx`
- `components/home/FeaturedDishesSection.tsx`
- `components/home/StorySection.tsx`
- `components/home/MenuCategoriesSection.tsx`
- `components/home/WhyChooseUsSection.tsx`
- `components/home/TestimonialsSection.tsx`
- `components/home/CtaSection.tsx`
- `components/menu/QuickAddButton.tsx`

**Modified:**
- `app/globals.css` (color tokens, `--radius`, `--font-heading`)
- `app/layout.tsx` (Fraunces font)
- `app/page.tsx` (full rewrite)
- `components/Navbar.tsx` (fixed + transparent-on-home + new colors)
- `app/(customer)/layout.tsx` (add `pt-16` for fixed navbar)
- `components/Footer.tsx` (visual redesign)
- `components/menu/MenuCard.tsx` (`id` prop, redesign, QuickAddButton)
- `components/menu/CategoryFilter.tsx` (color classes)
- `app/(customer)/menu/page.tsx` (`id={item.id}` prop)
- `package.json` (framer-motion)
