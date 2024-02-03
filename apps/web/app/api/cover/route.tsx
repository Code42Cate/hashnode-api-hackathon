import { getPostBySlug } from "@/api/hashnode";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { ImageResponse } from "next/server";
import { Tables } from "database/types";
import { cookies } from "next/headers";

const WIDTH = 2400;
const HEIGHT = 1260;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const host = url.searchParams.get("host");
  const slug = url.searchParams.get("slug");

  if (!host || !slug) {
    return new Response("Missing host or slug", {
      status: 400,
    });
  }

  const cookieStore = cookies();

  const supabase = createRouteHandlerClient(
    { cookies: () => cookieStore },
    {
      supabaseKey: process.env.SUPABASE_KEY,
    },
  );

  const { data: publication } = await supabase
    .from("publications")
    .select()
    .eq("host", host)
    .limit(1)
    .single<Tables<"publications">>();

  const post = await getPostBySlug(host, slug, publication.api_key);

  let baseImage = `https://puegijxqyzuokuoeclrk.supabase.co/storage/v1/object/public/original-covers/${post.id}.png`
  if (!post.coverImage.url.includes("hashnode-api-hackathon.onrender.com")) {
    baseImage = post.coverImage.url
  }

  try {
    return new ImageResponse(
      (
        <>
          <img
            alt="Cover Image"
            src={baseImage}
            width={WIDTH}
            height={HEIGHT}
            style={{
              objectFit: "cover",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              gap: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {post.comments.slice(0, 5).map((comment, index) => (
              <div
                key={comment.content + index}
                style={{
                  padding: "1rem",
                  background: "rgba(255, 255, 255)",
                  color: "black",
                  fontSize: "2rem",
                  width: "500px",
                  border: "1px solid black",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  flexDirection: "column",
                  fontFamily: "sans-serif",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginRight: "1rem",
                    color: "gray",
                  }}
                >
                  <img
                    alt="Profile Picture"
                    src={comment.profilePicture}
                    width={48}
                    height={48}
                    style={{
                      borderRadius: "50%",
                      marginRight: "0.5rem",
                      verticalAlign: "middle",
                    }}
                  />
                  {comment.username}:
                </div>

                <p
                  style={{
                    width: "480px",
                  }}
                >
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      {
        width: WIDTH,
        height: HEIGHT,
        headers: {
          "content-type": "image/png",
        },
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
