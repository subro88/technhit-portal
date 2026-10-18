import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard /admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const hasAuthjsToken = request.cookies.get("authjs.session-token")?.value;
    const hasSecureAuthjsToken = request.cookies.get("__Secure-authjs.session-token")?.value;
    const hasNextAuthToken = request.cookies.get("next-auth.session-token")?.value;
    const hasSecureNextAuthToken = request.cookies.get("__Secure-next-auth.session-token")?.value;
    const hasDevAuth = request.cookies.get("technhit_dev_auth")?.value;

    const isAuthenticated = Boolean(
      hasAuthjsToken ||
      hasSecureAuthjsToken ||
      hasNextAuthToken ||
      hasSecureNextAuthToken ||
      (hasDevAuth === "active")
    );

    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
