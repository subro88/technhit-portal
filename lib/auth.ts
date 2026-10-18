import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { env } from "@/lib/env";

const ADMIN_EMAILS = env.ADMIN_EMAILS;
const ADMIN_FALLBACK_PASSWORD = env.ADMIN_FALLBACK_PASSWORD || "TechNHIT#Cluster2026!";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "Admin Credentials",
      credentials: {
        email: { label: "Admin Email", type: "email", placeholder: "admin@technhit.in" },
        password: { label: "Cluster Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);

        const isAuthorizedEmail = ADMIN_EMAILS.includes(email);
        const isPasswordValid = password === ADMIN_FALLBACK_PASSWORD;

        if (isAuthorizedEmail && isPasswordValid) {
          return {
            id: `admin-${email}`,
            name: email.split("@")[0].toUpperCase(),
            email: email,
            role: "admin",
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "user";
      }
      const email = token.email?.toLowerCase() || "";
      token.isAdmin = ADMIN_EMAILS.includes(email) || token.role === "admin";
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).isAdmin = !!token.isAdmin;
        (session.user as any).role = token.role || "user";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET || "a78f3c9210e74b2195f1d04820dcbe649f7e52a812b3c4d5e6f7a8b9c0d1e2f3",
});
