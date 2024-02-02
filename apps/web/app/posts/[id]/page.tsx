import { createClient } from "@/utils/supabase/server";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { Tables } from "database/types";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";
import { EyeIcon, HeartIcon, MessageCircle } from "lucide-react";
import CoverSelect from "@/app/components/cover-select";
import { Label } from "@ui/components/ui/label";
import InteractiveSwitch from "@/app/components/interactive-switch";

type Post = {
  __typename: string;
  title: string;
  coverImage: {
    __typename: string;
    url: string;
  };
  id: string;
  views: number;
  responseCount: number;
  reactionCount: number;
  author: {
    __typename: string;
    name: string;
  };
  comments: {
    __typename: string;
    edges: Array<{
      __typename: string;
      node: {
        __typename: string;
        id: string;
        dateAdded: string;
        totalReactions: number;
        content: {
          __typename: string;
          text: string;
        };
        author: {
          __typename: string;
          username: string;
          name: string;
          profilePicture: string;
        };
      };
      cursor: string;
    }>;
    totalDocuments: number;
  };
};

async function getPost(host: string, apiKey: string, slug: string) {
  const client = new ApolloClient({
    uri: "https://gql.hashnode.com/",
    cache: new InMemoryCache(),
    headers: {
      Authorization: apiKey,
    },
  });

  const { data } = await client.query({
    query: gql`
      query Publication {
        publication(host: "${host}") {
          isTeam
          title
          post(slug: "${slug}") {
            title
            id
            coverImage {
              url
            }
            views
            author {
              name
            }
            tags {
              name
            }
            reactionCount
            responseCount
            comments(first: 1000) {
              edges {
                node {
                  id
                  dateAdded
                  totalReactions
                  content {
                    text
                  }
                  author {
                    name
                    username
                    profilePicture
                  }

                }
                cursor
              }
              totalDocuments
            }
          }
        }
      }
    `,
  });

  return data.publication.post as Post;
}

export default async function PostPage({
  params: { id },
}: {
  params: { id: string };
}) {
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

  const post = await getPost(
    currentPublication.host,
    currentPublication.api_key,
    id,
  );

  const { data: postMetadata } = await supabase
    .from("posts")
    .select()
    .eq("h_post_id", post.id)
    .limit(1)
    .returns<Tables<"posts">[]>()
    .single();

  return (
    <div className="flex flex-col gap-4 w-[800px]">
      <div className="flex flex-col gap-4">
        <div>
          <div className="justify-between flex flex-row items-center gap-2">
            <h1 className="text-2xl font-medium my-2">{post.title}</h1>
            <div className="flex flex-row items-center gap-2">
              <InteractiveSwitch
                enabled={postMetadata?.enabled}
                postId={post.id}
                slug={id}
                publicationId={currentPublication.id}
              />
              <Label htmlFor="interactive-mode">Interactive Mode</Label>
            </div>
          </div>
          <CoverSelect
            baseCoverImage={post.coverImage.url}
            customCoverImage={`https://hashnode-api-hackathon-web.vercel.app/api/cover?slug=${id}&host=${currentPublication.host}`}
          />
          <div className="flex flex-row items-center justify-between mt-2">
            <span className="text-neutral-700 text-sm">
              Written by {post.author.name}
            </span>
            <div className="flex flex-row text-neutral-700 text-sm items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              {post.views}
              <HeartIcon className="h-4 w-4 ml-4 mr-1" />
              {post.reactionCount}
              <MessageCircle className="h-4 w-4 ml-4 mr-1" />
              {post.responseCount}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {post.comments.edges.map((edge) => (
          <div
            key={edge.node.id}
            className="flex flex-col gap-2 border border-neutral-300 rounded-md p-4 w-full max-w-[400px]"
          >
            <div className="flex flex-row gap-2 items-center">
              <Image
                src={edge.node.author.profilePicture}
                width={48}
                alt=""
                height={48}
                className="rounded-full"
              />
              <div className="flex flex-col gap-1">
                <span className="font-medium">{edge.node.author.name}</span>
                <span className="text-neutral-700 text-sm">
                  {new Date(edge.node.dateAdded).toLocaleString()}
                </span>
              </div>
            </div>

            {edge.node.content.text}
          </div>
        ))}
      </div>
    </div>
  );
}
