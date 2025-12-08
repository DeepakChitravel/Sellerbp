/** @type {import('next').NextConfig} */
const nextConfig = {
images: {
  remotePatterns: [
    {
      protocol: "http",
      hostname: "localhost",
      pathname: "/managerbp/public/uploads/services/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      pathname: "/managerbp/public/uploads/sellers/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      pathname: "/managerbp/public/uploads/employees/**",
    },
    {
      protocol: "http",
      hostname: "localhost",
      pathname: "/managerbp/public/uploads/static/**",
    },
  ],
},

};

export default nextConfig;
