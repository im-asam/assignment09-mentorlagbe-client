"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient, inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    jwtClient(),
    // Makes the server's additionalFields (role, phone, bio, plan)
    // available on session.user with correct types.
    inferAdditionalFields<typeof auth>(),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;

export type Role = "student" | "tutor" | "admin";
export type Plan = "free" | "pro";
