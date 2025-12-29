import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: process.env.NODE_ENV == 'development' ? 'standalone' : 'export',
  distDir: process.env.NODE_ENV == "development" ? ".dev" : ".next",
  reactStrictMode: false,
  cleanDistDir: true,
  // Exclude backend and api folder from Next.js compilation
  webpack: (config, { isServer }) => {
    // Ignore backend and api folders during Next.js build
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/backend/**', '**/api/**'],
    };
    // Exclude api and backend from webpack compilation
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    // Add alias to prevent webpack from resolving backend/api during build
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '../backend/src/app.module': 'commonjs ../backend/src/app.module',
      });
    }
    return config;
  },
  // Only compile pages, app, and components - exclude api and backend
  pageExtensions: ['page.tsx', 'page.ts', 'tsx', 'ts', 'jsx', 'js'],
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
      // Backend uploads on VPS (with and without explicit port)
      {
        protocol: "http",
        hostname: "157.66.100.32",
        port: "3001",
      },
      {
        protocol: "https",
        hostname: "157.66.100.32",
        port: "3001",
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
