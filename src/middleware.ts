import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// حماية مسار الداشبورد فقط
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})

export const config = {
  matcher: [
    // استبعاد ملفات Next.js الداخلية والملفات الثابتة
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // السماح لـ Clerk بالمرور عبر مساراته
    '/(api|trpc)(.*)',
  ],
}