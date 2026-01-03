import { NextResponse } from "next/server";

/**
 * Proxy middleware for Next.js 16+
 * Only applies to API routes to avoid blocking page requests
 */
export function middleware(request) {
  // Pass through all requests without blocking
  return NextResponse.next();
}

/**
 * Configure middleware to only run on API routes
 * DO NOT use '/:path*' as it will block all page routes!
 */
export const config = {
  matcher: ["/api/:path*"],
};
