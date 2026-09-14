/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.php/about-us",
        destination: "/#about",
        permanent: true,
      },
      {
        source: "/index.php/services",
        destination: "/#products",
        permanent: true,
      },
      {
        source: "/index.php/contact-us",
        destination: "/#contact",
        permanent: true,
      },
      {
        source: "/about-us",
        destination: "/#about",
        permanent: true,
      },
      {
        source: "/services",
        destination: "/#products",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/#contact",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
