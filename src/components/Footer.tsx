import Link from "next/link";

/** X (formerly Twitter) logo — the current brand mark, not the old bird. */
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-950 text-brand-100">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                <path d="M12 3 1.5 8.25 12 13.5l10.5-5.25L12 3Zm-6.75 9.6v4.35c0 1.2 3.02 2.85 6.75 2.85s6.75-1.65 6.75-2.85V12.6L12 15.75 5.25 12.6Z" />
              </svg>
            </span>
            <span className="font-display text-xl font-bold tracking-tight text-white">
              Mentor<span className="text-brand-400">Lagbe</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-200/80">
            The smart tuition &amp; mentorship platform — find the right tutor
            for every subject, or share your knowledge with students who need it.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://x.com"
              target="_blank"
              rel="noreferrer"
              aria-label="MentorLagbe on X"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <XLogo className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="MentorLagbe on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H7.5v3h2.6v7h3.4Z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="MentorLagbe on LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M6.94 8.5v11H3.56v-11h3.38ZM7.15 5.4a1.96 1.96 0 1 1-3.92 0 1.96 1.96 0 0 1 3.92 0ZM12.1 19.5v-6.2c0-1.1.5-1.8 1.6-1.8 1 0 1.4.7 1.4 1.8v6.2h3.4v-6.7c0-2.7-1.4-4-3.7-4-1.7 0-2.5.9-2.9 1.6V8.5H8.6v11h3.5Z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="MentorLagbe on YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.28 5 12 5 12 5s-6.28 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.72 19 12 19 12 19s6.28 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/" className="text-brand-200/80 transition hover:text-white">Home</Link></li>
            <li><Link href="/tuitions" className="text-brand-200/80 transition hover:text-white">Browse Tuitions</Link></li>
            <li><Link href="/pricing" className="text-brand-200/80 transition hover:text-white">Pricing &amp; Pro Plans</Link></li>
            <li><Link href="/#how-it-works" className="text-brand-200/80 transition hover:text-white">How It Works</Link></li>
          </ul>
        </div>

        {/* For users */}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Get Started</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/sign-up" className="text-brand-200/80 transition hover:text-white">Create an Account</Link></li>
            <li><Link href="/sign-in" className="text-brand-200/80 transition hover:text-white">Sign In</Link></li>
            <li><Link href="/dashboard/tutor/post-tuition" className="text-brand-200/80 transition hover:text-white">Post a Tuition</Link></li>
            <li><Link href="/dashboard/profile" className="text-brand-200/80 transition hover:text-white">Update Profile</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-brand-200/80">
            <li>hello@mentorlagbe.com</li>
            <li>+880 1700-000000</li>
            <li>Cox&apos;s Bazar, Chattogram,<br />Bangladesh</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-brand-200/70 sm:flex-row sm:px-6">
          <p>© 2026 MentorLagbe. All rights reserved.</p>
          <p>Learn smarter. Teach wider.</p>
        </div>
      </div>
    </footer>
  );
}
