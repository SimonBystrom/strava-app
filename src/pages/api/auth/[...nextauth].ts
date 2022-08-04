import NextAuth, { type NextAuthOptions } from "next-auth";
import StravaProvider from "next-auth/providers/strava";
import { env } from "../../../env/server.mjs";
import Credentials from "next-auth/providers/credentials";
import { verify } from "argon2";

import { prisma } from "../../../server/db/client";
import { loginSchema } from "../../../server/validations/auth";




export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session: async ({ session, token }) => {
      // session = {
      //   ...session,
      //   user: {
      //     ...session.user,
      //     id: token?.sub
      //   }
      // }
      if (token) {
        session.id = token.id;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },
  },
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, request) => {
        const creds = await loginSchema.parseAsync(credentials);

        const user = await prisma.user.findFirst({
          where: { email: creds.email },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await verify(user.password, creds.password);

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  jwt: {
    secret: "super-secret",
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  pages: {
    signIn: "/",
    newUser: "/sign-up",
  },
}

export default NextAuth(authOptions);
