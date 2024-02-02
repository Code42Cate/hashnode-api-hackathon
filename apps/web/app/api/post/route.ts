import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { Database } from "database/types";

type RequestBody = {
  id: string;
  enabled: boolean;
  publicationId: number;
  slug: string;
};

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const body = (await request.json()) as RequestBody;

  const res = await supabase.from("posts").upsert({
    h_post_id: body.id,
    enabled: body.enabled,
    user_id: user.id,
    slug: body.slug,
    publication_id: body.publicationId,
  });

  return NextResponse.json(res.data);
}
