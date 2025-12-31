import EditArticleClient from "./EditArticleClient";

// Edge runtime required for Cloudflare Pages
export const runtime = 'edge';

export default function EditArticle() {
  return <EditArticleClient />;
}
