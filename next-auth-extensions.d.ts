// next-auth-extensions.d.ts
import NextAuth, { DefaultSession, DefaultToken, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}
