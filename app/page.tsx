import getBlogs from "@data/blogs";
import dynamic from "next/dynamic";

const HomePage = dynamic(() => import("@/components/home"));

const blogs = getBlogs;

export default async function Home() {
  const blogPosts = blogs
    .map((i) => i.content)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return <HomePage blogs={blogPosts} />;
}
