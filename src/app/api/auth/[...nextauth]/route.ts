import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ADMIN_EMAILS = ["workwithneeraj.01@gmail.com", "shashichanyal@gmail.com"];

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Allow linking accounts with same email
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Always allow sign in - no account linking restrictions
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // First time JWT callback, user object is available
      if (user) {
        token.id = user.id || (profile as any)?.sub;
        token.email = user.email || (profile as any)?.email;
        token.name = user.name || (profile as any)?.name;
        token.picture = user.image || (profile as any)?.picture;
        // Set role based on email
        token.role = (token.email && ADMIN_EMAILS.includes(token.email)) ? "admin" : "user";
      }
      // Ensure role is always set correctly
      if (token.email && ADMIN_EMAILS.includes(token.email)) {
        token.role = "admin";
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
