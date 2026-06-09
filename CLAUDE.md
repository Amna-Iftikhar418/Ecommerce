# CLAUDE.md — Restaurant E-Commerce Project

This file is the single source of truth for Claude Code in every session. Read it fully before taking any action.

---

## Project Overview

A production-ready, full-stack **restaurant e-commerce website** built with Next.js 15. Customers can browse a menu, add items to a cart, check out with Stripe, and track orders in real time. Admins manage the menu, orders, and customers through a protected dashboard.

This is a **real, deployable product** — not a demo or prototype. Every decision should reflect production quality.

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | Full-stack, SSR/ISR, file-based routing |
| Language | TypeScript | Strict mode — no `any` |
| Styling | Tailwind CSS + shadcn/ui | Utility-first + accessible components |
| Database | Neon PostgreSQL | Serverless Postgres via Vercel Marketplace |
| ORM | Prisma | Type-safe queries and migrations |
| Auth | Clerk | Session management, OAuth, role metadata |
| Payments | Stripe | Embedded checkout, webhooks |
| Image Storage | Vercel Blob | Food images, CDN delivery |
| Cart State | Zustand | Client-side cart, persisted to localStorage |
| Email | Resend | Order confirmation emails |
| Deployment | Vercel | Zero-config, edge network |

---

## Repository Structure

```
/app
  /(customer)
    /page.tsx                    ← Home page
    /menu/page.tsx               ← Menu browsing
    /menu/[slug]/page.tsx        ← Dish detail + add to cart
    /cart/page.tsx               ← Cart view
    /checkout/page.tsx           ← Address + Stripe checkout
    /orders/page.tsx             ← Order history
    /orders/[id]/page.tsx        ← Order tracking (real-time status)
    /orders/confirmation/page.tsx← Post-payment confirmation
    /account/page.tsx            ← User profile + saved addresses
    /about/page.tsx              ← Restaurant story, map, contact
  /(admin)
    /admin/page.tsx              ← Dashboard (stats)
    /admin/menu/page.tsx         ← Menu CRUD + image upload
    /admin/orders/page.tsx       ← Order management + status updates
    /admin/customers/page.tsx    ← Customer list + history
    /admin/settings/page.tsx     ← Hours, delivery radius, min order
  /api
    /webhooks/stripe/route.ts    ← Stripe webhook → create Order
    /orders/route.ts             ← Order CRUD
    /menu/route.ts               ← Menu CRUD

/components
  /ui                            ← shadcn/ui primitives (do not edit)
  /menu
    MenuCard.tsx
    CategoryFilter.tsx
    SearchBar.tsx
  /cart
    CartSidebar.tsx
    CartItem.tsx
  /checkout
    AddressForm.tsx
    PaymentForm.tsx
  /admin
    DataTable.tsx
    StatusBadge.tsx

/lib
  db.ts                          ← Prisma client singleton
  stripe.ts                      ← Stripe client + helpers
  auth.ts                        ← Clerk server-side helpers
  blob.ts                        ← Vercel Blob upload helper

/store
  cartStore.ts                   ← Zustand cart store

/prisma
  schema.prisma                  ← Database schema
  seed.ts                        ← Demo data seeder
```

---

## Database Schema

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  role      Role      @default(CUSTOMER)
  addresses Address[]
  orders    Order[]
  reviews   Review[]
}

enum Role { CUSTOMER ADMIN }

model Category {
  id        String     @id @default(cuid())
  name      String
  slug      String     @unique
  image     String?
  order     Int        @default(0)
  items     MenuItem[]
}

model MenuItem {
  id          String           @id @default(cuid())
  name        String
  description String
  price       Float
  image       String?
  slug        String           @unique
  categoryId  String
  category    Category         @relation(fields: [categoryId], references: [id])
  isAvailable Boolean          @default(true)
  rating      Float            @default(0)
  options     MenuItemOption[]
  orderItems  OrderItem[]
  reviews     Review[]
}

model MenuItemOption {
  id            String   @id @default(cuid())
  menuItemId    String
  menuItem      MenuItem @relation(fields: [menuItemId], references: [id])
  name          String
  choices       Json
  priceModifier Float    @default(0)
}

model Order {
  id          String      @id @default(cuid())
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  status      OrderStatus @default(PENDING)
  items       OrderItem[]
  total       Float
  address     Json
  paymentId   String?
  createdAt   DateTime    @default(now())
}

enum OrderStatus { PENDING PREPARING ON_THE_WAY DELIVERED CANCELLED }

model OrderItem {
  id         String   @id @default(cuid())
  orderId    String
  order      Order    @relation(fields: [orderId], references: [id])
  menuItemId String
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
  quantity   Int
  price      Float
  options    Json?
}

model Review {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  menuItemId String
  menuItem   MenuItem @relation(fields: [menuItemId], references: [id])
  rating     Int
  comment    String?
  createdAt  DateTime @default(now())
}
```

---

## Environment Variables

All variables live in `.env.local` for local dev and in the Vercel dashboard for deployed environments.

```env
# Neon PostgreSQL
DATABASE_URL=

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=

# Resend
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Key Conventions

### TypeScript
- Strict mode enabled. No `any` types.
- Use `type` for data shapes, `interface` only for extensible contracts.
- Co-locate types with the file that owns them; export only when shared.

### Next.js App Router
- Server Components by default. Add `"use client"` only when needed (event handlers, hooks, browser APIs).
- Data fetching happens in Server Components via Prisma, never in client components directly.
- API routes are only for webhooks and form mutations, not for data fetching that can be done server-side.

### Styling
- Tailwind utility classes only — no custom CSS files unless absolutely necessary.
- Use shadcn/ui components from `/components/ui` for all primitives (buttons, inputs, dialogs, etc.).
- Never edit files inside `/components/ui` directly; extend via wrappers.

### Auth & Authorization
- Clerk middleware protects `/account`, `/orders`, `/checkout`, and all `/admin/*` routes.
- Admin role is stored in Clerk user public metadata: `{ role: "ADMIN" }`.
- Check role server-side in admin routes — never trust client-side role checks for authorization.

### Payments
- Stripe Embedded Checkout — do not use Stripe Checkout redirect.
- Webhook at `/api/webhooks/stripe` handles `checkout.session.completed` to create the Order record.
- Always verify webhook signature using `STRIPE_WEBHOOK_SECRET`.

### Cart
- Cart state lives in Zustand (`store/cartStore.ts`) and is persisted to localStorage.
- Cart is client-only until checkout — no server-side cart persistence needed.

### Database
- Always use the Prisma singleton from `lib/db.ts` — never instantiate `PrismaClient` directly.
- Run migrations with `npx prisma migrate dev --name <description>`.
- Use `npx prisma studio` to inspect data locally.

### Images
- Food images are uploaded to Vercel Blob via `lib/blob.ts`.
- Always store the Blob URL in the `image` field of `MenuItem` or `Category`.
- Use Next.js `<Image>` component for all images — never plain `<img>` tags.

---

## Common Commands

```bash
# Development
npm run dev                          # Start dev server at localhost:3000

# Database
npx prisma migrate dev --name <name> # Create and apply a migration
npx prisma db push                   # Push schema without migration (prototyping only)
npx prisma studio                    # Open visual DB browser
npx prisma generate                  # Regenerate Prisma client after schema change
npx ts-node prisma/seed.ts           # Seed demo data

# Type checking
npx tsc --noEmit                     # Type check without emitting

# Linting
npm run lint                         # ESLint

# Build
npm run build                        # Production build
```

---

## Implementation Phases (Progress Tracker)

### Phase 1 — Scaffold & Infrastructure
- [ ] Next.js app, Prisma, Clerk, shadcn/ui set up
- [ ] `lib/db.ts`, `lib/auth.ts`, `lib/stripe.ts`, `lib/blob.ts` created
- [ ] Deployed to Vercel

### Phase 2 — Menu & Browsing
- [ ] DB seeded with categories and menu items
- [ ] Home, Menu, Dish Detail pages built

### Phase 3 — Cart & Checkout
- [ ] Zustand cart store with localStorage persistence
- [ ] Stripe embedded checkout + webhook
- [ ] Order confirmation page + Resend email

### Phase 4 — User Account & Order Tracking
- [ ] Clerk auth pages + middleware
- [ ] Order history + real-time tracking page

### Phase 5 — Admin Dashboard
- [ ] Role-based access, all admin pages built
- [ ] Menu CRUD with image uploads
- [ ] Order status management

### Phase 6 — Polish & Launch
- [ ] Mobile responsive, SEO, loading states, error boundaries
- [ ] Lighthouse audit passed
- [ ] Production deploy verified end-to-end

---

## Verification Checklist (Before Marking Complete)

1. `npm run dev` loads at `localhost:3000` with no console errors
2. Browse menu → add to cart → complete Stripe test checkout
3. Order record exists in DB (`npx prisma studio`)
4. Order confirmation email received via Resend
5. Admin logs in, updates order status
6. Customer tracking page reflects the status change
7. `npx tsc --noEmit` passes with zero errors
8. `npm run build` succeeds
9. Production Vercel URL passes the full flow above

---

## Do Not

- Do not use `any` in TypeScript
- Do not add `"use client"` unless required — prefer Server Components
- Do not instantiate `PrismaClient` outside `lib/db.ts`
- Do not skip Stripe webhook signature verification
- Do not edit files in `/components/ui` (shadcn primitives)
- Do not use plain `<img>` tags — always use Next.js `<Image>`
- Do not store secrets in code — use environment variables only
- Do not push to production without running the verification checklist
