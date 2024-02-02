"use client";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@ui/components/ui/button";
import { useRouter } from "next/router";

async function signInWithGithub() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });
}

export default function Page() {
  return (
    <div>
      <div className="backdrop" />

      <div className="flex flex-col w-screen p-4 gap-y-10 h-screen">
        <header className="flex flex-row justify-between w-full">
          <span className="font-mono font-semibold">HIP</span>
          <Button onClick={signInWithGithub} variant="default">
            Sign Up
          </Button>
        </header>

        <div className="mx-auto text-center flex flex-col gap-4 items-center">
          <h1 className="font-mono text-5xl font-semibold">
            Interactive Hashnode Posts
          </h1>

          <p className="text-gray-600">
            Engage your audience with interactive content. Each comment yeets
          </p>

          <Button onClick={signInWithGithub} className="bg-orange-400 w-fit">
            Login with Github
          </Button>
        </div>

        <div className="mx-auto rounded-xl bg-white shadow-lg max-w-[769px] max-h-[500px] w-full h-full">
          <iframe
            title="vimeo-player"
            src="https://player.vimeo.com/video/881604037?h=4ffbe61be6"
            className="max-w-[769px] max-h-[500px] rounded-xl w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
