module.exports = {
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    domains: ["cdn.hashnode.com", "media.dev.to", "localhost", "hashnode-api-hackathon.onrender.com", "puegijxqyzuokuoeclrk.supabase.co"],
  },
  experimental: {
    serverActions: true,
  },
  output: "standalone"
};
