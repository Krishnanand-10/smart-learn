import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = (req, ctx) => NextAuth(authOptions)(req, ctx);

export { handler as GET, handler as POST }
