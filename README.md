# Jaosef Agro Supplies

Jaosef Agro Supplies is a React, TypeScript, Vite, Hono, and tRPC website for a Kenyan agricultural input supplier. It includes an enquiry-only public storefront, farming tips, WhatsApp enquiry flows, legal/disclaimer pages, and secure admin management.

## Features

- Product catalogue with categories, search, product detail pages, related products, and no public prices.
- Farming tips listing and article detail pages.
- Contact and WhatsApp enquiry entry points.
- Admin dashboard for products, enquiries, farming tips, featured products, image URL updates, and direct image uploads.
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

When `DATABASE_URL` is not set in development, the API serves demo products, farming tips, and enquiries so the website can be reviewed immediately after cloning. Production still requires the environment values in `.env.example`.

## Useful Scripts

```bash
npm run check
npm run lint
npm run build
npm run test
npm run admin:hash
npm run admin:totp
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:seed
```

## Truehost / cPanel Deployment Notes

For production on cPanel Node.js hosting:

1. Create a MySQL database and user in cPanel.
2. Set the Node.js app environment variables:

```bash
NODE_ENV=production
DATABASE_URL=mysql://USER:PASSWORD@localhost:3306/DATABASE
APP_SECRET=<long-random-secret>
ADMIN_PASSWORD_HASH=<generated-with-npm-run-admin:hash>
```

3. Build and prepare the database:

```bash
npm install
npm run build
npm run db:push
npm run db:seed
```

4. Use `server.cjs` as the cPanel Node.js startup file, or use `npm run start` if cPanel asks for a command.

Uploaded images are stored in `uploads/images` in production so they are not erased by rebuilding `dist/public`.

Authenticator-app 2FA can be enabled or disabled from the admin dashboard Security tab. The optional `ADMIN_TOTP_SECRET` env var is only a server-managed fallback; leave it unset if the client should manage 2FA in the dashboard.

## Design Notes

The visual direction uses agricultural imagery, warm neutral surfaces, deep green brand color, and a harvest-orange call to action. The strongest next design improvements would be adding richer loading and empty states, improving mobile admin layouts, and code-splitting the admin/dashboard routes to reduce the initial bundle size.
