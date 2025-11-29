import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: process.env.NODE_ENV == 'development' ? 'standalone' : 'export',
  distDir: process.env.NODE_ENV == "development" ? ".dev" : ".next",
  reactStrictMode: false,
  cleanDistDir: true,
  // Transpile CKEditor packages
  transpilePackages: [
    "@ckeditor/ckeditor5-react",
    "@ckeditor/ckeditor5-build-classic",
  ],
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.reshot.com",
        port: "",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
      },
      {
        protocol: "http",
        hostname: "157.66.100.32",
        port: "",
      },
      {
        protocol: "https",
        hostname: "157.66.100.32",
        port: "",
      },
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  },
});

export default withMDX(nextConfig);
