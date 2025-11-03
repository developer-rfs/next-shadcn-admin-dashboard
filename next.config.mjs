/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    domains: ["ddf-backend-static.s3.amazonaws.com"],
  },
  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/dashboard/tournaments",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
