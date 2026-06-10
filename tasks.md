# Restaurant E-Commerce — Task List

## Phase 1 — Scaffold & Infrastructure

- [x] Run `create-next-app` with TypeScript + Tailwind CSS
- [x] Install and configure Prisma + connect to Neon PostgreSQL
- [x] Write `prisma/schema.prisma` (User, Category, MenuItem, MenuItemOption, Cart, CartItem, Order, OrderItem, Review)
- [x] Run initial Prisma migration
- [x] Install and configure Clerk auth
- [x] Install and configure shadcn/ui
- [x] Create `lib/db.ts` — Prisma client singleton
- [x] Create `lib/auth.ts` — Clerk helpers
- [x] Create `lib/stripe.ts` — Stripe client + helpers
- [x] Create `lib/blob.ts` — Vercel Blob upload helper
- [x] Set up environment variables in `.env.local`
- [x] Deploy blank app to Vercel and link project

---

## Phase 2 — Menu & Browsing

- [x] Write `prisma/seed.ts` — seed categories and menu items with demo data
- [ ] Upload demo food images to Vercel Blob
- [x] Build Home page (`app/(customer)/page.tsx`) — hero banner, featured dishes, categories, testimonials, CTA
- [x] Build `components/menu/CategoryFilter.tsx`
- [x] Build `components/menu/SearchBar.tsx`
- [x] Build `components/menu/MenuCard.tsx` — image, name, price, rating
- [x] Build Menu page (`app/(customer)/menu/page.tsx`) — category filter, search, dish grid
- [x] Build Dish Detail page (`app/(customer)/menu/[slug]/page.tsx`) — description, customizations, add-to-cart

---

## Phase 3 — Cart & Checkout

- [x] Create `store/cartStore.ts` — Zustand store with localStorage persistence
- [x] Build `components/cart/CartSidebar.tsx` — slide-out cart, quantity controls, subtotal
- [x] Build `components/cart/CartItem.tsx`
- [x] Build Checkout page (`app/(customer)/checkout/page.tsx`) — address form, delivery/pickup toggle, Stripe embedded checkout
- [x] Build `components/checkout/AddressForm.tsx`
- [x] Build `components/checkout/PaymentForm.tsx`
- [x] Create `app/api/orders/route.ts` — create order endpoint
- [x] Create `app/api/webhooks/stripe/route.ts` — handle Stripe webhook → create Order in DB
- [x] Build Order Confirmation page (`app/(customer)/orders/confirmation/page.tsx`) — summary display
- [x] Integrate Resend — send order confirmation email on successful payment

---

## Phase 4 — User Account & Order Tracking

- [x] Add Clerk sign-in / sign-up pages and middleware
- [x] Build User Account page (`app/(customer)/account/page.tsx`) — profile, saved addresses
- [x] Build Orders list page (`app/(customer)/orders/page.tsx`) — order history
- [x] Build Order Tracking page (`app/(customer)/orders/[id]/page.tsx`) — status timeline (Pending → Preparing → On the way → Delivered)
- [x] Implement polling or real-time status updates on tracking page

---

## Phase 5 — Admin Dashboard

- [x] Set ADMIN role in Clerk user metadata
- [x] Add middleware to protect `/admin` routes (role check)
- [x] Build Admin Dashboard (`app/(admin)/admin/page.tsx`) — revenue, orders, top dishes stats
- [x] Build `components/admin/DataTable.tsx`
- [x] Build `components/admin/StatusBadge.tsx`
- [x] Build Menu Management page (`app/(admin)/admin/menu/page.tsx`) — list, add, edit, delete dishes + image upload
- [x] Build Order Management page (`app/(admin)/admin/orders/page.tsx`) — view all orders, update status
- [x] Build Customer Management page — user list, per-customer order history
- [x] Build Settings page — restaurant hours, delivery radius, minimum order
- [x] Create `app/api/menu/route.ts` — menu CRUD endpoints

---

## Phase 6 — Polish & Launch

- [x] Mobile-responsive audit and fixes across all pages
- [x] Add SEO metadata and Open Graph tags to all pages
- [x] Add loading skeletons for menu, cart, and order pages
- [x] Add error boundaries
- [x] Build About / Contact page (`app/(customer)/about/page.tsx`) — restaurant story, location map, contact form
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
