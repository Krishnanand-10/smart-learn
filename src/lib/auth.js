import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/db';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  debug: true,
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: (() => {
        console.log("[Auth Config Check] GOOGLE_CLIENT_ID defined:", !!process.env.GOOGLE_CLIENT_ID);
        console.log("[Auth Config Check] GOOGLE_CLIENT_SECRET defined:", !!process.env.GOOGLE_CLIENT_SECRET);
        return process.env.GOOGLE_CLIENT_ID;
      })(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
};
