const generateMockPosts = () => {
  const posts = [];
  const now = Date.now();
  const hour = 60 * 60 * 1000;

  // Trending post (high engagement, recent)
  posts.push({
    id: "trending-1",
    author: {
      name: "Alex Thompson",
      title: "Product Marketing Lead",
      avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef",
    },
    content:
      "🚀 Just launched our new product feature! The response has been incredible! #ProductLaunch #Innovation",
    images: ["https://images.unsplash.com/photo-1542744173-8e7e53415bb0"],
    timestamp: new Date(now - 2 * hour).toISOString(),
    likes: 450,
    comments: 89,
    shares: 125,
    hasLiked: false,
  });

  // Popular but not trending (high engagement, older)
  posts.push({
    id: "popular-1",
    author: {
      name: "Maria Garcia",
      title: "Senior Developer",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
    },
    content:
      "Sharing my keynote presentation from the tech conference last week. Great discussions on AI! #TechConference",
    images: [
      "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa",
      "https://images.unsplash.com/photo-1540317578276-b3762ae84904",
    ],
    timestamp: new Date(now - 7 * 24 * hour).toISOString(),
    likes: 892,
    comments: 234,
    shares: 156,
    hasLiked: false,
  });

  // Recent but low engagement
  posts.push({
    id: "recent-1",
    author: {
      name: "James Wilson",
      title: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    },
    content:
      "Working on some new design concepts. Would love your feedback! 🎨",
    images: ["https://images.unsplash.com/photo-1561070791-2526d30994b5"],
    timestamp: new Date(now - 1 * hour).toISOString(),
    likes: 12,
    comments: 3,
    shares: 0,
    hasLiked: false,
  });

  // Moderately popular and recent
  posts.push({
    id: "trending-2",
    author: {
      name: "Sarah Chen",
      title: "Senior Product Designer",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    content:
      "Here's a sneak peek of our new design system! 👀 #DesignSystem #UX",
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5",
      "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e",
    ],
    timestamp: new Date(now - 4 * hour).toISOString(),
    likes: 230,
    comments: 45,
    shares: 28,
    hasLiked: false,
  });

  // Old post with moderate engagement
  posts.push({
    id: "archive-1",
    author: {
      name: "Robert Lee",
      title: "Engineering Manager",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    },
    content: "Throwback to our team building event! Great memories! 🎉",
    images: ["https://images.unsplash.com/photo-1522071820081-009f0129c71c"],
    timestamp: new Date(now - 30 * 24 * hour).toISOString(),
    likes: 145,
    comments: 28,
    shares: 12,
    hasLiked: false,
  });

  return posts;
};

export const MOCK_POSTS = generateMockPosts();

// Test data sets for different scenarios
export const TEST_CASES = {
  trending: MOCK_POSTS.filter((post) => {
    const hoursSincePost =
      (Date.now() - new Date(post.timestamp)) / (1000 * 60 * 60);
    const engagementScore = post.likes + post.comments * 2 + post.shares * 3;
    return hoursSincePost <= 24 && engagementScore > 300;
  }),
  popular: MOCK_POSTS.sort(
    (a, b) =>
      b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares)
  ),
  latest: MOCK_POSTS.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  ),
};

// Utility function to verify sorting algorithms
export const verifyAlgorithms = () => {
  console.log("Trending Posts:", TEST_CASES.trending);
  console.log("Popular Posts:", TEST_CASES.popular);
  console.log("Latest Posts:", TEST_CASES.latest);
};
