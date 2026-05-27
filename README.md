# Kilimo Essentials

Kilimo Essentials is a React, TypeScript, Vite, Hono, and tRPC website for a Kenyan agricultural input supplier. It includes a public storefront, farming tips, WhatsApp enquiry flows, and an admin dashboard scaffold.

## Features

- Product catalogue with categories, search, product detail pages, and related products.
- Farming tips listing and article detail pages.
- Contact and WhatsApp enquiry entry points.
- Admin dashboard UI for products, enquiries, and farming tips.
- MySQL schema and seed data managed with Drizzle.

## Tech Stack

- React 19 and Vite
- TypeScript
- Tailwind CSS
- Hono and tRPC
- Drizzle ORM with MySQL
- Framer Motion and lucide-react

## Getting Started

Install dependencies:

```bash
npm install
```

Copy the example environment file and fill in the values:

```bash
cp .env.example .env
```

Run the development server:

```bash
npm run dev
```

The app is configured for `http://localhost:3000`.

## Useful Scripts

```bash
npm run check
npm run lint
npm run build
npm run test
npm run db:generate
npm run db:migrate
npm run db:push
```

## Design Notes

The visual direction uses agricultural imagery, warm neutral surfaces, deep green brand color, and a harvest-orange call to action. The strongest next design improvements would be adding richer loading and empty states, improving mobile admin layouts, and code-splitting the admin/dashboard routes to reduce the initial bundle size.
