import { AuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import https from 'https';
// import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import apiAuthSignIn from '@/utils/auth';
import { postRequest } from '@/lib/fetch';
const options: AuthOptions = {
  //SIGN IN CHAY TRUOC JWT, TRONG SIGNIN SE RETURN 1 THANG USER, JWT CHAY TRUOC SESSION
  // Configure one or more authentication providers
  providers: [
    DiscordProvider({
      clientId: String(process.env.DISCORD_CLIENT_ID),
      clientSecret: String(process.env.DISCORD_CLIENT_SECRET),
      async profile(profile) {
        //cai profile nay se truyen xuong jwt function

        // const user = await prisma.user.findUnique({
        //   where: {
        //     email: profile.email,
        //   },
        // });
        const user = {
          id: '4b98e7c5-8440-4789-8b31-de5d10171404',
          name: 'Customer',
          email: 'customer@gmail.com',
          role: 'customer',
        };
        return user;
      },
    }),

    GithubProvider({
      clientId: String(process.env.GITHUB_CLIENT_ID),
      clientSecret: String(process.env.GITHUB_CLIENT_SECRET),
      async profile(profile) {
        //cai profile nay se truyen xuong jwt function
        // const user = await prisma.user.findUnique({
        //   where: {
        //     email: profile.email,
        //   },
        // });
        const user = {
          id: '4b98e7c5-8440-4789-8b31-de5d10171404',
          name: 'Customer',
          email: 'customer@gmail.com',
          role: 'customer',
        };
        return user;
      },
    }),
    GoogleProvider({
      clientId: String(process.env.GOOGLE_CLIENT_ID),
      clientSecret: String(process.env.GOOGLE_CLIENT_SECRET),
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
      async profile(profile) {
        //cai profile nay se truyen xuong jwt function
        // const user = await prisma.user.findUnique({
        //   where: {
        //     email: profile.email,
        //   },
        // });
        const user = {
          id: '4b98e7c5-8440-4789-8b31-de5d10171404',
          name: 'Customer',
          email: 'customer@gmail.com',
          role: 'customer',
        };
        return user;
      },
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('Received credentials:', credentials);

        if (!credentials) {
          throw new Error('Invalid credentials');
        }

        if (
          credentials.email !== 'customer@gmail.com' ||
          credentials.password !== 'Test@123'
        ) {
          return null; // Authentication failed
        }
        const user = {
          id: '4b98e7c5-8440-4789-8b31-de5d10171404',
          name: 'Customer',
          email: 'customer@gmail.com',
          role: 'customer',
        };
        return user; // Return authenticated user
      },
    }),

    // ...add more providers here
  ],

  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXT_PUBLIC_JWT_SECRET, // Replace with your JWT secret
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },

    async session({ token, session }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { name: string }).name = token.name as string;
        (session.user as { access_token: string }).access_token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJhZG1pbkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9naXZlbm5hbWUiOiJBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IltcIkFkbWluXCJdIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJkMDU2ZjJkYi0yZDIwLTRjM2MtYjIyNC04N2ZjZjU3YTFiMGIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJleHAiOjYxNzMzOTQxMjY5LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxOTkiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxOTkifQ.gm5M55Tae5ih2JUPwYqbMwEknK_9njMdng1usBNEmMM';
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};
export default options;
