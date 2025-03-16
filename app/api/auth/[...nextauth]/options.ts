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
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      if (token.email) {
        const user = await getUserByEmail(token.email) as IUser;
        if(user) {
          if(user.role) {
            session.user.role = user.role;
          }
        }
      }

      return session;
    },
  },
};
