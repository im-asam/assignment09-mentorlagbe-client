# MentorLagbe — Client

**MentorLagbe** is a Smart Tuition & Mentorship Platform (Programming Hero
Assignment 9, Category 001). It connects qualified Tutors who post
subject-wise tuition batches and 1-on-1 mentorships with Students looking
for personalized academic guidance, while Admins moderate listings, users,
and Stripe subscription payments.

- **Live site:** https://assignment09-mentorlagbe-client.vercel.app
- **API server:** https://assignment09-mentorlagbe-server.vercel.app
- **Server repo:** https://github.com/im-asam/assignment09-mentorlagbe-server

## Test Accounts

| Role | Email | Password |
| ---- | ----- | -------- |
| Admin | admin@mentorlagbe.com | Admin123! |
| Tutor | tutor@mentorlagbe.com | Tutor123! |
| Student | student@mentorlagbe.com | Student123! |

## Key Features

- **Role-based auth (BetterAuth + JWT):** sign up as Student or Tutor;
  JWTs issued by the BetterAuth JWT plugin (EdDSA) are sent as
  `Authorization: Bearer` tokens to the Express API. Logged-in users are
  never bounced to login on reload of a private route.
- **Browse tuitions:** server-side search (title/subject), filters
  (subject, class level, Online/Offline), and server-side pagination.
- **Tuition details + apply flow:** only students can apply (phone,
  preferred schedule, note); duplicate applications are rejected with a
  friendly message.
- **Stripe Pro plans:** Tutor Pro ($15/mo, unlimited posts + verified
  badge), Student Pro ($10/mo, priority booking). Free tutors can post up
  to 2 tuitions.
- **Student dashboard:** overview stats, My Applications with cancel
  (pending only).
- **Tutor dashboard:** overview stats, Post a Tuition (ImgBB banner upload
  with image-URL fallback), full My Tuitions CRUD with Active/Closed
  toggle, Applicants accept/reject.
- **Admin dashboard:** platform stats (users, tutors, pending vs approved
  tuitions, Stripe revenue), user role management, tuition approve/reject,
  transactions table.
- **Profile:** update name, phone, bio, and profile picture (ImgBB upload
  or image URL).
- **Extras:** dark/light theme toggle, toast notifications on every form
  and CRUD action, skeleton loading states, custom 404 and error pages,
  fully responsive (mobile / tablet / desktop).

## Routes

| Route | Description |
| ----- | ----------- |
| `/` | Hero, 6 featured tuitions, pricing teaser, How It Works, top subjects, testimonials |
| `/tuitions` | Browse approved & active tuitions (search, filters, pagination) |
| `/tuitions/[id]` | Tuition details + student-only apply form |
| `/pricing` | Free vs Pro plans with Stripe checkout |
| `/sign-up`, `/sign-in` | Role-based registration and login |
| `/payment/success`, `/payment/cancel` | Stripe checkout result pages |
| `/dashboard` | Redirects to the role overview |
| `/dashboard/student`, `/dashboard/student/my-applications` | Student overview & applications |
| `/dashboard/tutor`, `/dashboard/tutor/post-tuition`, `/dashboard/tutor/my-tuitions`, `/dashboard/tutor/applicants` | Tutor overview, posting, CRUD, applicants |
| `/dashboard/admin`, `/dashboard/admin/users`, `/dashboard/admin/tuitions`, `/dashboard/admin/transactions` | Admin overview, users, moderation, payments |
| `/dashboard/profile` | Update profile (all roles) |

## Tech Stack / npm Packages

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (`@tailwindcss/turbopack`)
- **better-auth** + **@better-auth/mongo-adapter** (MongoDB adapter, JWT plugin)
- **mongodb** (driver)
- **framer-motion** (animations)
- **react-hot-toast** (toast notifications)

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Purpose |
| -------- | ------- |
| `BETTER_AUTH_SECRET` | Signs session cookies and JWTs (must match the server) |
| `BETTER_AUTH_URL` | Public URL of this app |
| `MONGODB_URI` | MongoDB Atlas URI for the `mentorlagbe` database |
| `NEXT_PUBLIC_API_URL` | Base URL of the Express API server |
| `NEXT_PUBLIC_IMGBB_API_KEY` | (Optional) ImgBB key for direct image uploads; without it the UI falls back to image-URL input |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | (Optional) Google sign-in |

## Run Locally

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # production build
npm start      # serve the production build
```
