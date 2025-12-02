/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.bookpannu.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },

      // ⭐ Correct PHP folder (NOW WITH /public)
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/managerbp/public/uploads/employees/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/managerbp/public/uploads/employees/**",
      },
    ],
  },
};

export default nextConfig;
