// Trending score calculation based on recent engagement
export const calculateTrendingScore = (post) => {
  const now = new Date();
  const postDate = new Date(post.timestamp);
  const hoursSincePost = (now - postDate) / (1000 * 60 * 60);

  // Engagement score: likes + (comments * 2) + (shares * 3)
  const engagementScore = post.likes + post.comments * 2 + post.shares * 3;

  // Trending score decays over time (24-hour window)
  return engagementScore / Math.pow(hoursSincePost + 2, 1.5);
};

// Post sorting functions
export const sortFunctions = {
  latest: (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  popular: (a, b) =>
    b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares),
  trending: (a, b) => calculateTrendingScore(b) - calculateTrendingScore(a),
};

// Post filtering functions
export const filterFunctions = {
  latest: (posts) => posts.sort(sortFunctions.latest),
  popular: (posts) => posts.sort(sortFunctions.popular),
  trending: (posts) => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return posts
      .filter((post) => new Date(post.timestamp) > twentyFourHoursAgo)
      .sort(sortFunctions.trending);
  },
};
