# Restaurant E-Commerce — Task List

## Phase 1 — Scaffold & Infrastructure

- [ ] Run `create-next-app` with TypeScript + Tailwind CSS
- [ ] Install and configure Prisma + connect to Neon PostgreSQL
- [ ] Write `prisma/schema.prisma` (User, Category, MenuItem, MenuItemOption, Cart, CartItem, Order, OrderItem, Review)
- [ ] Run initial Prisma migration
- [ ] Install and configure Clerk auth
- [ ] Install and configure shadcn/ui
- [ ] Create `lib/db.ts` — Prisma client singleton
- [ ] Create `lib/auth.ts` — Clerk helpers
- [ ] Create `lib/stripe.ts` — Stripe client + helpers
- [ ] Create `lib/blob.ts` — Vercel Blob upload helper
- [ ] Set up environment variables in `.env.local`
- [ ] Deploy blank app to Vercel and link project

---

## Phase 2 — Menu & Browsing

- [ ] Write `prisma/seed.ts` — seed categories and menu items with demo data
- [ ] Upload demo food images to Vercel Blob
- [ ] Build Home page (`app/(customer)/page.tsx`) — hero banner, featured dishes, categories, testimonials, CTA
- [ ] Build `components/menu/CategoryFilter.tsx`
- [ ] Build `components/menu/SearchBar.tsx`
- [ ] Build `components/menu/MenuCard.tsx` — image, name, price, rating
- [ ] Build Menu page (`app/(customer)/menu/page.tsx`) — category filter, search, dish grid
- [ ] Build Dish Detail page (`app/(customer)/menu/[slug]/page.tsx`) — description, customizations, add-to-cart

---

## Phase 3 — Cart & Checkout

- [ ] Create `store/cartStore.ts` — Zustand store with localStorage persistence
- [ ] Build `components/cart/CartSidebar.tsx` — slide-out cart, quantity controls, subtotal
- [ ] Build `components/cart/CartItem.tsx`
- [ ] Build Checkout page (`app/(customer)/checkout/page.tsx`) — address form, delivery/pickup toggle, Stripe embedded checkout
- [ ] Build `components/checkout/AddressForm.tsx`
- [ ] Build `components/checkout/PaymentForm.tsx`
- [ ] Create `app/api/orders/route.ts` — create order endpoint
- [ ] Create `app/api/webhooks/stripe/route.ts` — handle Stripe webhook → create Order in DB
- [ ] Build Order Confirmation page (`app/(customer)/orders/confirmation/page.tsx`) — summary display
- [ ] Integrate Resend — send order confirmation email on successful payment

---

## Phase 4 — User Account & Order Tracking

- [ ] Add Clerk sign-in / sign-up pages and middleware
- [ ] Build User Account page (`app/(customer)/account/page.tsx`) — profile, saved addresses
- [ ] Build Orders list page (`app/(customer)/orders/page.tsx`) — order history
- [ ] Build Order Tracking page (`app/(customer)/orders/[id]/page.tsx`) — status timeline (Pending → Preparing → On the way → Delivered)
- [ ] Implement polling or real-time status updates on tracking page

---

## Phase 5 — Admin Dashboard

- [ ] Set ADMIN role in Clerk user metadata
- [ ] Add middleware to protect `/admin` routes (role check)
- [ ] Build Admin Dashboard (`app/(admin)/admin/page.tsx`) — revenue, orders, top dishes stats
- [ ] Build `components/admin/DataTable.tsx`
- [ ] Build `components/admin/StatusBadge.tsx`
- [ ] Build Menu Management page (`app/(admin)/admin/menu/page.tsx`) — list, add, edit, delete dishes + image upload
- [ ] Build Order Management page (`app/(admin)/admin/orders/page.tsx`) — view all orders, update status
- [ ] Build Customer Management page — user list, per-customer order history
- [ ] Build Settings page — restaurant hours, delivery radius, minimum order
- [ ] Create `app/api/menu/route.ts` — menu CRUD endpoints

---

## Phase 6 — Polish & Launch

- [ ] Mobile-responsive audit and fixes across all pages
- [ ] Add SEO metadata and Open Graph tags to all pages
- [ ] Add loading skeletons for menu, cart, and order pages
- [ ] Add error boundaries
- [ ] Build About / Contact page (`app/(customer)/about/page.tsx`) — restaurant story, location map, contact form
- [ ] Run Lighthouse performance audit and address findings
- [ ] Final production deploy to Vercel
- [ ] Smoke test full flow on production: browse → cart → Stripe test checkout → order confirmation email → admin status update → tracking page reflects change

---

## Verification Checklist

- [ ] `npm run dev` — app loads at `localhost:3000`
- [ ] Browse menu, add items to cart, complete Stripe test checkout
- [ ] DB has created Order record (verify via `npx prisma studio`)
- [ ] Order confirmation email arrives via Resend
- [ ] Admin can log in, update order status
- [ ] Customer tracking page reflects status change
- [ ] Production URL on Vercel passes the same flow
