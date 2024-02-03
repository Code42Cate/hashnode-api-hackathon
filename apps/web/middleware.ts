import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "database/types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  console.log(process.env.NEXT_PUBLIC_SUPABASE_URL!)
  console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient<Database>({ req, res }, {
    supabaseUrl:  process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  return res;
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
