import { UserNav } from "../components/user-nav";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PublicationSwitcher from "../components/publication-switcher";
import { Tables } from "database/types";

import { createClient } from "@/utils/supabase/server";

export default async function Layout({ children }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/");
  }

  const { data: publications } = await supabase
    .from("publications")
    .select()
    .returns<Tables<"publications">[]>();

  return (
    <div className="p-4 flex flex-col gap-4">
      <header className="flex flex-row justify-between items-center">
        <PublicationSwitcher
          publications={publications.map((p) => ({
            label: p.host,
            value: p.api_key,
          }))}
        />
        <UserNav
          avatar={data.user.user_metadata["avatar_url"]}
          email={data.user.email}
          name={data.user.user_metadata["full_name"]}
        />
      </header>
      {children}
    </div>
  );
}
