import { withAuth } from "@kinde-oss/kinde-auth-nextjs/middleware";

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico, sitemap.xml, robots.txt (metadata files)
       */
      '/((?!api|about|discover|services|contact|_next/static|_next/image|home.png|second.png|favicon.ico|sitemap.xml|robots.txt|$).*)',
    ],
  }

  export default withAuth;