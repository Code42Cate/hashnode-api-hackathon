import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { Database } from "database/types";
import { getPosts } from "@/api/hashnode";

export async function POST(request: Request) {
  const formData = await request.formData();
  const host = String(formData.get("host"));
  const apiKey = String(formData.get("api_key"));
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // validate that we can get data from the host
  try {
    await getPosts(host, apiKey);
  } catch (error) {
    return new Response(error.message, { status: 400 });
  }

  await supabase
    .from("publications")
    .insert({ api_key: apiKey, host: host, user_id: user.id });

  return NextResponse.redirect("/posts", {
    status: 301,
  });
}
