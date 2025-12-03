/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // EMPLOYEES
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/managerbp/public/uploads/employees/**",
      },

      // CATEGORIES
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/managerbp/public/uploads/categories/**",
      },

      // ⭐ SELLERS — REQUIRED (your image lives inside here)
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/managerbp/public/uploads/sellers/**",
      },

      // STATIC (logo, placeholders, etc.)
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/managerbp/public/uploads/static/**",
      }
    ],
  },
};

export default nextConfig;
