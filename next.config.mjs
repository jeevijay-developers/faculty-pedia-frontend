/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
