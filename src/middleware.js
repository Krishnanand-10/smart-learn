export { default } from "next-auth/middleware"

export const config = { 
  matcher: [
    "/dashboard/:path*", 
    "/profile/:path*", 
    "/flashcards/:path*", 
    "/chat/:path*", 
    "/quiz/:path*", 
    "/input-hub/:path*"
  ] 
}
