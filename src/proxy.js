import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Proxy middleware for Next.js 16+
 * Protects authenticated routes and API routes
 */
export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ["/watchlist", "/profile", "/favorite"];

  // Check if the current path is a protected route,
  // but allow /public/ paths even under protected routes
  const isProtectedRoute =
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !pathname.includes("/public/");

  // Create response object to handle cookies
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  if (isProtectedRoute) {
    // Create Supabase client for server-side auth check
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            request.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            request.cookies.set({
              name,
              value: "",
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: request.headers,
              },
            });
            response.cookies.set({
              name,
              value: "",
              ...options,
            });
          },
        },
      }
    );

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      // Redirect to login if not authenticated
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Pass through all other requests
  return response;
}

/**
 * Configure middleware to run on API routes and protected pages
 */
export const config = {
  matcher: [
    "/api/:path*",
    "/watchlist/:path*",
    "/profile/:path*",
    "/favorite/:path*",
  ],
};
