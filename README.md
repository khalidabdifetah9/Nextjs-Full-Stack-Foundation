# HueEstate

**Find a home, walk through it in 360°, and try your own wall colors before you decide.**

HueEstate is a real estate platform I built after struggling to find a house in my country. Instead of traveling to every viewing, people can preview homes remotely, reserve one they like, and book a visit.

Live demo:(https://nextjs-full-stack-foundation--kalidAb.replit.app)           · Built solo on [Replit](https://replit.com)





<img width="1448" height="1086" alt="HueEstate Modern Real Estate Hero" src="https://github.com/user-attachments/assets/017a7d71-6c31-4e02-bd5f-dde39f0a97b1" />

## Features

**For visitors and clients**
- **360° home tours:** move between rooms through labelled hotspots, with drag, zoom, auto-rotate and fullscreen.
- **Live wall recoloring:** choose a color and strength and see the walls change in real time, keeping the room's real shadows and lighting.
- **Reservations:** hold a home for 1 to 14 days so nobody else can take it, paid through Chapa hosted checkout, with a printable receipt.
- **Appointment booking:** a custom calendar where booked, past and closed days can't be selected.
- **My Activity:** reservations, payments and appointments in one place.
- **Accounts:** email sign-up with a password strength meter, Google sign-in, password recovery by email, and profile editing.
- **Help assistant:** a button-based chatbot answering common questions.

**For admins**
- **Role based admin panel:** create, edit, hide and delete homes with any number of rooms.
- **Image uploads to Replit App Storage:** 360° panoramas, wall masks and thumbnails, each validated on the server.
- **Client activity:** see who is arriving today and tomorrow, with tap to call numbers, active reservations and payments.

## Tech stack

| Area | Technology |
|---|---|
| Front end | Next.js 16 (App Router), React, TypeScript, Tailwind CSS v4 |
| Back end | Next.js server actions and route handlers, Express API server |
| Database |Replit PostgreSQL Databases with Drizzle ORM |
| Auth | Better Auth (email and password, Google OAuth, roles) |
| Payments | Chapa (hosted checkout, server-side verification) |
| 360° viewer | Pannellum, with a canvas-based recoloring engine |
| Media | Replit App Storage |
| Email | Nodemailer (Gmail SMTP) |
| Tooling | pnpm workspaces, Replit Deployments, Replit Security Scanner | Replit Object Storage | Checkpoints and version control

## How it works

- **Recoloring:** each room has a panorama and a mask (white = paintable walls). The browser tints only the masked pixels, scaled by their original brightness so shadows stay realistic, and swaps the result into the viewer.
- **Payments:** the server creates a pending order and reservation, sends the customer to Chapa, then verifies the payment with Chapa (status, amount, currency and reference) before activating anything. A partial unique index in Postgres guarantees one active reservation per home.
- **Media:** the database stores bucket object keys. A route serves images from the private bucket, so they stay same-origin for the canvas.

## Security

- Every price, permission and booking rule is enforced on the server. The UI only hides things.
- Role checks run in layouts, server actions and route handlers.
- Uploads are validated by file bytes (type, 2:1 ratio, size) and given random keys.
- Payments are verified with Chapa before a reservation is activated.
- Unique indexes prevent double-booking of appointments and homes.
- Password reset links are single-use and expire after 1 hour, and the form never reveals whether an email has an account.
- Dependencies are audited with `pnpm audit` and the Replit Security Scanner.

## Project structure

```
artifacts/
├─ next-foundation/    # Next.js app (site, dashboard, admin, auth)
├─ api-server/         # Express API
└─ mockup-sandbox/     # Design previews
lib/
├─ db/                 # Drizzle schema, shared database client
└─ api-zod/            # Shared validators
```

## Getting started

Requires Node.js and pnpm. Media uploads rely on Replit App Storage, so run the project on Replit for the full experience.

```bash
pnpm install
```

Set these environment variables (Replit Secrets):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Long random string for sessions |
| `BETTER_AUTH_URL` | Public URL of the site |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `CHAPA_SECRET_KEY` | Chapa key (test or live) |
| `MEDIA_BUCKET_ID` | Replit App Storage bucket |
| `SMTP_USER`, `SMTP_PASS` | Gmail address and app password for emails |

Create the tables and run the app:

```bash
pnpm --filter @workspace/db run push
pnpm --filter @workspace/next-foundation run dev
pnpm --filter @workspace/api-server run dev
```

Make yourself an admin after signing up:

```sql
update "user" set role = 'admin' where email = 'you@example.com';
```

## Status and roadmap

Payments currently run in **Chapa test mode**.

- [ ] Chapa webhook, so reservations activate even if the user closes the tab
- [ ] Email verification
- [ ] Automatic appointment reminders by email or SMS
- [ ] Automated tests
- [ ] Live payments

## About

Built by **[Kalid Abdifeta]**, a developer with over 4 years of experience in React, Next.js and TypeScript, and a computer science graduate of [University name].
Developed solo with AI Some assistance (Replit Agent and an AI assistant). I made the product and architecture decisions.

[Contra](https://contra.com/khalid_abdifetah_e14xoprk/work?r=khalid_abdifetah_e14xoprk) · [LinkedIn](https://www.linkedin.com/in/kalid-abdifeta-197630412/) · [Email](khalid121619217@gmail.com)
