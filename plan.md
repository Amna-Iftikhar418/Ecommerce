# Restaurant E-Commerce Website — Implementation Plan

## Context
Build a production-ready, modern restaurant e-commerce website from scratch. The goal is a real, deployable product with full ordering functionality, admin controls, payments, and a polished UI — not a demo or prototype.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Full-stack, SSR/ISR, file-based routing |
| Language | **TypeScript** | Type safety across full stack |
| Styling | **Tailwind CSS + shadcn/ui** | Modern, fast, accessible components |
| Database | **Neon PostgreSQL** (Vercel Marketplace) | Serverless Postgres, branching, free tier |
| ORM | **Prisma** | Type-safe DB queries, migrations |
| Auth | **Clerk** | Vercel-native, handles sessions, OAuth |
| Payments | **Stripe** | Checkout, webhooks, order tracking |
| Image Storage | **Vercel Blob** | Food images, CDN delivery |
| State | **Zustand** | Lightweight cart state management |
| Email | **Resend** | Order confirmation emails |
| Deployment | **Vercel** | Zero-config deployment, edge network |

---

## Features & Pages

### Customer-Facing
1. **Home Page** — Hero banner, featured dishes, categories, testimonials, CTA
2. **Menu Page** — Category filter, search, dish cards with images/price/rating
3. **Dish Detail Page** — Full description, customizations (size, toppings), add to cart
4. **Cart Sidebar** — Slide-out cart, quantity control, subtotal
5. **Checkout Page** — Address, delivery/pickup toggle, Stripe payment
6. **Order Confirmation** — Summary + email receipt
7. **Order Tracking Page** — Real-time status (Pending → Preparing → On the way → Delivered)
8. **User Account** — Order history, saved addresses, profile
9. **About / Contact Page** — Restaurant story, location map, contact form

### Admin Dashboard (`/admin`)
1. **Dashboard** — Revenue, orders, top dishes stats
2. **Menu Management** — Add/edit/delete dishes, categories, upload images
3. **Order Management** — View all orders, update status
4. **Customer Management** — User list, order history per customer
5. **Settings** — Restaurant hours, delivery radius, minimum order

---

## Database Schema (Prisma)

```
User           — id, email, name, role (CUSTOMER | ADMIN), addresses
Category       — id, name, slug, image, order
MenuItem       — id, name, description, price, image, categoryId, isAvailable, rating
MenuItemOption — id, menuItemId, name, choices (JSON), priceModifier
Cart           — id, userId, items (CartItem[])
CartItem       — id, cartId, menuItemId, quantity, options
Order          — id, userId, status, items, total, address, paymentId, createdAt
OrderItem      — id, orderId, menuItemId, quantity, price, options
Review         — id, userId, menuItemId, rating, comment
```

---

## Project Structure

```
/app
  /(customer)
    /page.tsx              ← Home
    /menu/page.tsx
    /menu/[slug]/page.tsx  ← Dish detail
    /cart/page.tsx
    /checkout/page.tsx
    /orders/page.tsx
    /orders/[id]/page.tsx  ← Tracking
    /account/page.tsx
  /(admin)
    /admin/page.tsx
    /admin/menu/page.tsx
    /admin/orders/page.tsx
  /api
    /webhooks/stripe/route.ts
    /orders/route.ts
    /menu/route.ts

/components
  /ui            ← shadcn/ui primitives
  /menu          ← MenuCard, CategoryFilter, SearchBar
  /cart          ← CartSidebar, CartItem
  /checkout      ← AddressForm, PaymentForm
  /admin         ← DataTable, StatusBadge

/lib
  /db.ts         ← Prisma client
  /stripe.ts     ← Stripe client + helpers
  /auth.ts       ← Clerk helpers
  /blob.ts       ← Vercel Blob upload

/prisma
  /schema.prisma
  /seed.ts       ← Demo data
```

---

## Implementation Phases

### Phase 1 — Scaffold & Infrastructure
- `create-next-app` with TypeScript + Tailwind
- Install and configure: Prisma + Neon, Clerk auth, shadcn/ui
- Set up environment variables (Vercel dashboard)
- Deploy blank app to Vercel

### Phase 2 — Menu & Browsing
- Seed DB with categories and menu items
- Build Home, Menu, and Dish Detail pages
- Image upload to Vercel Blob

### Phase 3 — Cart & Checkout
- Zustand cart store (persist to localStorage)
- Checkout flow with Stripe embedded checkout
- Stripe webhook → create Order in DB
- Order confirmation page + Resend email

### Phase 4 — User Account & Order Tracking
- Clerk-powered auth (sign in / sign up)
- Order history page
- Order status tracking page (polling or real-time)

### Phase 5 — Admin Dashboard
- Role-based access (ADMIN role in Clerk metadata)
- Menu CRUD with image uploads
- Order management with status updates

### Phase 6 — Polish & Launch
- Mobile-responsive testing
- SEO metadata, Open Graph tags
- Loading skeletons, error boundaries
- Performance audit (Lighthouse)
- Production deploy on Vercel

---

## Critical Files to Create

- `prisma/schema.prisma` — DB schema
- `app/(customer)/page.tsx` — Home page
- `app/(customer)/menu/page.tsx` — Menu browsing
- `app/api/webhooks/stripe/route.ts` — Payment webhook
- `components/cart/CartSidebar.tsx` — Cart UI
- `lib/db.ts`, `lib/stripe.ts`, `lib/auth.ts` — Shared clients
- `store/cartStore.ts` — Zustand cart

---

## Verification

1. Run `npm run dev` — app loads at localhost:3000
2. Browse menu, add items to cart, complete Stripe test checkout
3. Check DB for created Order record
4. Verify order confirmation email arrives (Resend)
5. Log in as admin, update order status, confirm customer tracking page reflects change
6. Run `npx prisma studio` to inspect DB directly
7. Deploy to Vercel, run same flow on production URL
