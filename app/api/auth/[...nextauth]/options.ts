import { IUser } from "@/interface/general.interface";
import { getUserByEmail } from "@/service/firestoreService";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) {
        return false; // Prevent sign-in if no email is provided
      }
      const existingUser = await getUserByEmail(user.email) as IUser;
      if (!existingUser) {
        return false; // Prevent sign-in if the user is not in the database
      }
      return true; // Allow sign-in if the user exists
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.email) {
        const user = await getUserByEmail(token.email) as IUser;
        if (user) {
          if (user.role) {
            session.user.role = user.role;
          }
          if (user.shopId) {
            session.user.shopId = user.shopId;
          }
        }
      }

      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect failed sign-ins to /login
    // error: "/error",  // Redirect errors (like UserNotFound) to /login
  },
};
