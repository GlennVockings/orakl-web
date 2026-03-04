import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, jwt } from "better-auth/plugins"
import { prisma } from "./prisma";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_APP_URL,

  // This is the important bit: Better Auth stores sessions/users in DB via Prisma.
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    fields: {
      name: "displayName",
    },
  },

  plugins: [
    bearer(),
    jwt({
      jwt: {
        expirationTime: "1h"
      }
    }),
  ],

  // Helps with cookies/cors when calling /api/auth from browser
  trustedOrigins: ["http://localhost:3000"],
});
