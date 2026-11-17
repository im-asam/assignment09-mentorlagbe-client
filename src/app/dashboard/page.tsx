"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, type Role } from "@/lib/auth-client";
import Spinner from "@/components/Spinner";

const ROLE_HOME: Record<Role, string> = {
  student: "/dashboard/student",
  tutor: "/dashboard/tutor",
  admin: "/dashboard/admin",
};

/** /dashboard root: send each role to its own overview. */
export default function DashboardRootPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    const role = (session?.user as { role?: Role } | undefined)?.role ?? "student";
    router.replace(ROLE_HOME[role]);
  }, [isPending, session, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Spinner label="Opening your dashboard…" />
    </div>
  );
}
