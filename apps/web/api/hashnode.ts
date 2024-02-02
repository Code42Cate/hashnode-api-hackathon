import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

type Post = {
  title: string;
  slug: string;
  url?: string;
  coverImage: {
    url: string;
  } | null;
  comments: {
    id: string;
    content: string;
    username: string;
    profilePicture: string;
  }[];
};

export async function getPostBySlug(
  publication: string,
  slug: string,
  apiKey: string
) {
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
        publication(host: "${publication}") {
          isTeam
          title
          post(slug: "${slug}") {
            title
            coverImage {
              url
            }
            url
            comments(first: 5, sortBy: RECENT) {
              edges {
                node {
                  id
                  content {
                    text
                  }
                  author {
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

  const comments = data.publication.post.comments.edges.map((edge: any) => {
    return {
      id: edge.node.id,
      content: edge.node.content.text,
      username: edge.node.author.username,
      profilePicture: edge.node.author.profilePicture,
    };
  });

  const post: Post = {
    title: data.publication.post.title,
    coverImage: data.publication.post.coverImage,
    comments,
    slug,
    url: data.publication.post.url,
  };

  return post;
}

export async function getPosts(host: string, apiKey: string) {
  const client = new ApolloClient({
    uri: "https://gql.hashnode.com/",
    cache: new InMemoryCache(),
    headers: {
      Authorization: apiKey,
    },
  });

  const { data, error } = await client.query({
    query: gql`
      query Publication {
        publication(host: "${host}") {
          isTeam
          title
          id
          posts(first: 10) {
            edges {
              node {
                title
                id
                brief
                slug
                url
                coverImage {
                  url
                }
              }
            }
          }
        }
      }
    `,
  });

  if (data === null) {
    throw new Error("Invalid API key or host");
  }

  return data.publication.posts.edges.map((edge: any) => edge.node) as Post[];
}

interface UpdatePostInput {
  id: string;
  coverImageOptions: {
    coverImageURL: string;
  };
}

async function updatePost(id: string, url: string, apiKey: string) {
  const client = new ApolloClient({
    uri: "https://gql.hashnode.com/",
    cache: new InMemoryCache(),
    headers: {
      Authorization: apiKey,
    },
  });

  const input: UpdatePostInput = {
    id: "65a979c3a5002c06e45ccf29",
    coverImageOptions: {
      coverImageURL:
        "https://media.dev.to/cdn-cgi/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fdrih4qg6i5h86nv7t4o8.png",
    },
  };

  try {
    const result = await client.mutate({
      mutation: gql`
        mutation UpdatePost($input: UpdatePostInput!) {
          updatePost(input: $input) {
            post {
              coverImage {
                url
              }
            }
          }
        }
      `,
      variables: { input },
    });

    // Access the result as needed
    console.log(result.data);
  } catch (error) {
    // Handle errors
    console.error(error);
  }
}
