# Server API Contract (client view)

The client codes against the MentorLagbe Express API exactly as below.
Base URL: `NEXT_PUBLIC_API_URL`
(`https://assignment09-mentorlagbe-server.vercel.app` in production).
Protected calls send `Authorization: Bearer <JWT>` where the JWT comes from
the BetterAuth JWT plugin (`authClient.token()`).

## Public

| Method & path | Notes |
| ------------- | ----- |
| `GET /tuitions?search&subject&classLevel&mode&page&limit` | Approved + active only. Returns `{tuitions, total, page, totalPages}`. Home uses `limit=6`. |
| `GET /tuitions/:id` | Single tuition (public). |

## Tutor

| Method & path | Notes |
| ------------- | ----- |
| `GET /tuitions/mine` | Tutor's own listings. |
| `POST /tuitions` | Body: title, subject, classLevel, mode, location, monthlyFee, daysPerWeek, bannerImage, description. Free plan max 2 → `403` with message. |
| `PATCH /tuitions/:id` | Owner only; incl. `isActive` toggle. |
| `DELETE /tuitions/:id` | Owner only. |
| `GET /applications/tutor` | Applicants to own tuitions. |
| `PATCH /applications/:id/status` | Body `{status: "accepted" \| "rejected"}`. |

## Student

| Method & path | Notes |
| ------------- | ----- |
| `POST /applications` | Body: tuitionId, studentPhone, preferredSchedule, studentNote. Duplicate → `409`. |
| `GET /applications/mine` | Student's own applications. |
| `DELETE /applications/:id` | Pending only. |

## Profile / users

| Method & path | Notes |
| ------------- | ----- |
| `GET /users/me` | Current user's profile (role, plan, phone, bio, image). |
| `PATCH /users/me` | Body: name, phone, bio, image. |

## Admin

| Method & path | Notes |
| ------------- | ----- |
| `GET /admin/stats` | `{totalUsers, totalTutors, pendingTuitions, approvedTuitions, totalRevenue, ...}` |
| `GET /admin/users` | All users. |
| `PATCH /admin/users/:id/role` | Body `{role}`. |
| `GET /admin/tuitions` | All tuitions. |
| `PATCH /admin/tuitions/:id/status` | Body `{approvalStatus}`. |
| `GET /admin/transactions` | Stripe payment records. |

## Payments

| Method & path | Notes |
| ------------- | ----- |
| `POST /payments/create-checkout-session` | Body `{plan: "tutor-pro" \| "student-pro"}` → `{url}`. |
| `POST /payments/verify-session` | Body `{sessionId}`. |

## Auth (served by this Next.js app, not the Express server)

BetterAuth lives in this app (`/api/auth/[...all]`), MongoDB adapter on
database `mentorlagbe`, user collection `users` (via `modelName`), JWT
plugin (EdDSA). The Express server verifies JWTs via this app's
`/api/auth/jwks` endpoint (HS256 fallback with the shared
`BETTER_AUTH_SECRET`).

## Field shapes

Tuition: `_id, title, subject, classLevel, mode ("Online"|"Offline"),
location, monthlyFee, daysPerWeek, bannerImage, description, tutorName,
tutorEmail, approvalStatus ("pending"|"approved"|"rejected"), isActive,
createdAt`.

Application: `_id, tuitionId, tuitionTitle, subject, monthlyFee,
tutorEmail, studentName, studentEmail, studentPhone, preferredSchedule,
studentNote, status ("pending"|"accepted"|"rejected"), appliedAt`.
