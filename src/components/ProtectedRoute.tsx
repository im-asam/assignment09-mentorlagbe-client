"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, type Role } from "@/lib/auth-client";
import Spinner from "./Spinner";

const ROLE_HOME: Record<Role, string> = {
  student: "/dashboard/student",
  tutor: "/dashboard/tutor",
  admin: "/dashboard/admin",
};

/**
 * Client-side guard for private pages.
 * While the session is still loading, show a spinner and DO NOT redirect —
 * this is what keeps a logged-in user from being bounced to /sign-in on
 * a page reload. Only redirect once loading is done and there is no user.
 * When `roles` is given, a signed-in user with the wrong role is sent to
 * their own dashboard overview instead of seeing a blank page.
 */
export default function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles?: Role[];
}) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const role = (session?.user as { role?: Role } | undefined)?.role;

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (roles && role && !roles.includes(role)) {
      router.replace(ROLE_HOME[role]);
    }
  }, [isPending, session, role, roles, router, pathname]);

  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (roles && role && !roles.includes(role)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner label="Redirecting to your dashboard…" />
      </div>
    );
  }

  return <>{children}</>;
}
