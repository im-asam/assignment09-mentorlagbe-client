# Deployment Checklist (MentorLagbe client)

The app is built and verified locally (`npm run build` passes; all routes
serve 200 from the production build). The two remote steps below were
blocked by account permissions on 2026-11-17 — do them in order.

## 1. GitHub repo (needed before the push)

The Muse GitHub App cannot create repositories (`create_repository` →
`403 Resource not accessible by integration`). Create it by hand:

1. On github.com, create **im-asam/assignment09-mentorlagbe-client**
   (public, empty — no README/gitignore/license needed).
2. Add the repo to the Muse GitHub App installation (Connectors → GitHub
   → repository selection), so `push_files` can write to it.
3. Then push from this machine:

```bash
cd ~/workspace/mentorlagbe-client
git ls-files --cached --others --exclude-standard -z -- . \
  ':(glob,exclude)**/*.muse-github-snapshot-sync.json' \
  ':(glob,exclude)**/*.muse-github-snapshot-sync.json.tmp-*' \
  > /tmp/mentorlagbe-client-paths.txt
/opt/hatch/bin/github push-files --owner im-asam \
  --repo assignment09-mentorlagbe-client --branch master \
  --message "MentorLagbe client — full Next.js app" \
  --source-dir ~/workspace/mentorlagbe-client \
  --paths-file /tmp/mentorlagbe-client-paths.txt
```

Known risk: `push_files` may fail on the large `package-lock.json`. If it
does, retry with the lockfile excluded from the manifest and note the gap —
Vercel can still install from `package.json`.

## 2. Vercel project (team "Sam" scope)

BookNook lives under team **Sam** (`sam-e97c`,
`team_Wl4ko8O9EcclH6UIWUNiszpV`). The Vercel MCP connection currently gets
`403 Not authorized` for that scope, and the `authorize_team_access` tool
is not available in this MCP server — Asam must re-approve team access for
the Muse Vercel connection (Vercel Dashboard → Settings → Applications, or
a fresh OAuth connect that includes the Sam team). After that:

1. Create the project from the GitHub repo (same scope as BookNook):
   project name `assignment09-mentorlagbe-client`.
2. Set environment variables (Production + Preview):
   - `MONGODB_URI` — Atlas URI for database `mentorlagbe`
     (same cluster as BookNook; value in `~/workspace/booknook-client/.env.local`,
     db name switched to `mentorlagbe`)
   - `BETTER_AUTH_SECRET` — value in `~/workspace/mentorlagbe-shared/coord.env`
     (same value the server uses; never print or commit it)
   - `BETTER_AUTH_URL=https://assignment09-mentorlagbe-client.vercel.app`
   - `NEXT_PUBLIC_API_URL=https://assignment09-mentorlagbe-server.vercel.app`
   - (No ImgBB key exists — skip `NEXT_PUBLIC_IMGBB_API_KEY`; the UI falls
     back to image-URL input.)
3. Deploy and run `./scripts/smoke-test.sh` against the live URL.

## 3. Examiner accounts

After deploy, create the three test accounts via the live sign-up page
(or the server's seed, if it provides one):
`admin@mentorlagbe.com / Admin123!`, `tutor@mentorlagbe.com / Tutor123!`,
`student@mentorlagbe.com / Student123!`. The admin account's role must be
`admin` — sign up normally, then flip the role via the admin users table
(or directly in the `users` collection).
