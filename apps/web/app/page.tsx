"use client";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@ui/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/router";

async function signInWithGithub() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
      <div className="flex flex-col w-screen p-4 gap-y-10 h-screen">
        <header className="flex flex-row justify-between w-full">
          <span className="font-mono font-semibold">HIP</span>
          <Button onClick={signInWithGithub} variant="default">
            Sign Up
          </Button>
        </header>

        <div className="mx-auto text-center flex flex-col gap-4 items-center">
          <h1 className="font-mono text-5xl font-semibold">
            Interactive Hashnode Cover Images
          </h1>

          <p className="text-gray-600">
            Engage your audience with interactive cover images, built for the
            Hashnode API Hackathon.
          </p>

          <Button onClick={signInWithGithub} className="bg-orange-400 w-fit">
            Login with Github
          </Button>
        </div>

        <Image
          width={1600}
          height={840}
          alt="examples"
          src="https://hashnode-api-hackathon.onrender.com/api/cover?slug=what-makes-an-engaging-post&host=code42cate.hashnode.dev"
          className="mx-auto shadow-xl object-cover rounded-xl w-[800px] h-[420px] border border-gray-300"
        />
      </div>
    </div>
  );
}
