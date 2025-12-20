import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import clientPromise from '@/lib/mongodb';

// Admin settings collection name
const SETTINGS_COLLECTION = 'adminSettings';

// Default admin emails - these are fallback if database doesn't have any
const DEFAULT_ADMIN_EMAILS = [
  'admin@smartsolutionsmumbai.com',
];

// Function to get admin emails from database
async function getAdminEmails(): Promise<string[]> {
  try {
    const client = await clientPromise;
    const db = client.db('loan-sarathi');
    const settings = await db.collection(SETTINGS_COLLECTION).findOne({ _id: 'main' } as any);
    
    if (settings?.settings?.adminEmails && Array.isArray(settings.settings.adminEmails)) {
      return settings.settings.adminEmails;
    }
    
    return DEFAULT_ADMIN_EMAILS;
  } catch (error) {
    console.error('Error fetching admin emails:', error);
    return DEFAULT_ADMIN_EMAILS;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/admin/signin',
    error: '/admin/signin',
  },
  callbacks: {
    async signIn({ user }) {
      // Check if the user's email is in the admin list
      const adminEmails = await getAdminEmails();
      const userEmail = user.email?.toLowerCase();
      
      if (!userEmail) {
        return false;
      }
      
      const isAdmin = adminEmails.some(
        (email) => email.toLowerCase() === userEmail
      );
      
      if (!isAdmin) {
        return '/admin/signin?error=AccessDenied';
      }
      
      return true;
    },
    async session({ session, token }) {
      // Add isAdmin flag to session
      if (session.user?.email) {
        const adminEmails = await getAdminEmails();
        session.user.isAdmin = adminEmails.some(
          (email) => email.toLowerCase() === session.user?.email?.toLowerCase()
        );
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
