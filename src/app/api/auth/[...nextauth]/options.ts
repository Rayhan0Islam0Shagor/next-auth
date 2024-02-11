import { ISODateString, NextAuthOptions, User } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { JWT } from 'next-auth/jwt';
import connectDB from '@/backend/DB';
import { User as UserModel } from '@/backend/models/User';

export type CustomSession = {
  user?: CustomUser;
  expires: ISODateString;
};

export type CustomUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  avatar?: string | null;
};

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
  },

  callbacks: {
    async signIn({ user }) {
      try {
        connectDB();

        const existingUser = await UserModel.findOne({ email: user?.email });
        if (existingUser) {
          return true;
        }

        await UserModel.create({
          name: user?.name,
          email: user?.email,
          role: 'user',
        });

        return true;
      } catch (error) {
        console.log('error');

        return false;
      }
    },

    async jwt({ token, user }: { token: JWT; user: CustomUser }) {
      if (user) {
        user.role = user?.role == null ? 'user' : user?.role;
        token.user = user;
      }
      return token;
    },

    async session({
      session,
      token,
      user,
    }: {
      session: CustomSession;
      token: JWT;
      user: User;
    }) {
      session.user = token.user as CustomUser;
      return session;
    },
  },

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'Enter your email',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        await connectDB();

        const user = await UserModel.findOne({ email: credentials?.email });

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
};
