import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { db, mongoClient } from "./db";

/**
 * Google sign-in is enabled only when its env vars are present,
 * so the app builds and runs without Google OAuth configured.
 */
const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client: mongoClient,
    // Works on any MongoDB topology, including standalone servers without
    // replica-set transactions (e.g. some free/shared tiers).
    transaction: false,
  }),
  emailAndPassword: { enabled: true },
  socialProviders,
  user: {
    // The spec requires the collection to be named `users`.
    modelName: "users",
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "student",
        input: true,
      },
      phone: { type: "string", required: false, input: true },
      bio: { type: "string", required: false, input: true },
      plan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
    },
  },
  session: {
    // Signed JWT session data in a cookie: session validation becomes
    // stateless and works from ANY serverless isolate (proxy, pages, API),
    // without a database round-trip on every request.
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days — matches session lifetime
    },
  },
  plugins: [
    // Issues JWTs (via authClient.token()) that the Express API verifies
    // with the shared secret / JWKS endpoint to protect its routes.
    jwt(),
  ],
});

/** Which social providers are actually configured (for the auth UI). */
export const configuredProviders = {
  google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
};
