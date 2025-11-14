import dynamic from "next/dynamic";

const NewsHero = dynamic(() => import("@components/NewsHero"));
const NewsGrid = dynamic(() => import("@components/NewsGrid"));
const NewsCategories = dynamic(() => import("@components/NewsCategories"));
const ContributionActivity = dynamic(
  () => import("@components/ContributionActivity"),
);

const HomePage = ({ blogs }: { blogs: any[] }) => {
  // Filter out draft posts and sort by date
  const sortedPosts = [...blogs]
    .filter((post) => !post.draft)
    .sort((a, b) => 
      new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
    )
    // Filter out posts with problematic images temporarily
    .filter((post) => {
      // Skip posts that might have image issues
      if (post.images && Array.isArray(post.images) && post.images[0]) {
        const imgSrc = post.images[0];
        // Only include if image is a valid string
        return typeof imgSrc === 'string';
      }
      return true;
    });

  // Featured post (most recent)
  const featuredPost = sortedPosts[0];

  // Latest posts (excluding featured)
  const latestPosts = sortedPosts.slice(1, 7);

  // More posts
  const morePosts = sortedPosts.slice(7, 13);

  return (
    <div className="space-y-12">
      {/* Hero Section - Featured News */}
      {featuredPost && <NewsHero featuredPost={featuredPost} />}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest News - Takes 2 columns */}
        <div className="lg:col-span-2 space-y-8">
          {latestPosts.length > 0 && (
            <NewsGrid posts={latestPosts} title="Latest News" />
          )}
          
          {morePosts.length > 0 && (
            <NewsGrid posts={morePosts} title="More News" />
          )}
        </div>

        {/* Sidebar - Takes 1 column */}
        <div className="space-y-6">
          <NewsCategories posts={sortedPosts} />
          <ContributionActivity />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
