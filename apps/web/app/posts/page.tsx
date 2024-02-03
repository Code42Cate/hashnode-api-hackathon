import { getPosts } from "@/api/hashnode";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "database/types";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function PostsPage() {
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

  const currentPublication =
    publications.find((p) => p.is_default) || publications[0];

  const posts = currentPublication
    ? await getPosts(currentPublication.host, currentPublication.api_key)
    : [];

  return (
    <>
      <h1 className="text-xl font-medium">Posts</h1>
      <div className="flex flex-row flex-wrap gap-4">
        {posts.map((post) => (
          <Link
            href={`/posts/${post.slug}`}
            key={post.url}
            className="border transition-all bg-white hover:scale-105 shadow-sm transform-gpu hover:cursor-pointer rounded-md border-neutral-300 text-sm w-[300px] flex flex-col"
          >
            {post.coverImage ? (
              <Image
                alt={post.title}
                src={post.coverImage.url}
                width={300}
                height={140}
                className="rounded-t-md w-[300px] h-[140px] object-cover"
              />
            ) : (
              <div className="rounded-t-md w-[300px] h-[140px] bg-neutral-200" />
            )}

            <div className="p-2 truncate">{post.title}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
