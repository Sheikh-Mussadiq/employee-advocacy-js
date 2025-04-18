const generateMockPosts = () => {
  const posts = [];
  const now = Date.now();
  const hour = 60 * 60 * 1000;

  // Generate a few sample comments
  const sampleComments = [
    {
      id: "comment-1",
      author: {
        name: "Jamie Smith",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
      },
      text: "This is amazing! Can't wait to try it out!",
      timestamp: new Date(now - 1 * hour).toISOString(),
      likes: 12,
      hasLiked: false,
    },
    {
      id: "comment-2",
      author: {
        name: "Michael Brown",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      },
      text: "Really impressive work. Could you share more details about how this was implemented?",
      timestamp: new Date(now - 2 * hour).toISOString(),
      likes: 5,
      hasLiked: false,
    },
    {
      id: "comment-3",
      author: {
        name: "Taylor Wilson",
        avatar: "https://images.unsplash.com/photo-1614289371518-722f2615943d",
      },
      text: "👏 Congratulations on the launch!",
      timestamp: new Date(now - 30 * 60 * 1000).toISOString(),
      likes: 8,
      hasLiked: false,
    },
    {
      id: "comment-4",
      author: {
        name: "Sophia Rodriguez",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      },
      text: "I've been waiting for this feature for a long time. Thank you!",
      timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
      likes: 3,
      hasLiked: false,
    },
  ];

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
    commentsList: [
      {
        id: "comment-1",
        author: {
          name: "Jamie Smith",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
        },
        text: "This is amazing! Can't wait to try it out!",
        timestamp: new Date(now - 1 * hour).toISOString(),
        likes: 12,
        hasLiked: false,
        replies: [
          {
            id: "reply-1-1",
            author: {
              name: "Alex Thompson",
              avatar:
                "https://images.unsplash.com/photo-1519345182560-3f2917c472ef",
            },
            text: "Thanks Jamie! We're really excited about it too! Let me know what you think after trying it.",
            timestamp: new Date(now - 55 * 60 * 1000).toISOString(),
            likes: 3,
            hasLiked: false,
          },
          {
            id: "reply-1-2",
            author: {
              name: "Nora Adams",
              avatar:
                "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a",
            },
            text: "I've been using it for the last hour and it's a game-changer!",
            timestamp: new Date(now - 30 * 60 * 1000).toISOString(),
            likes: 5,
            hasLiked: false,
          },
        ],
      },
      sampleComments[1],
      sampleComments[2],
      {
        id: "comment-trending-1",
        author: {
          name: "Raj Patel",
          avatar:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
        },
        text: "The UI is incredibly intuitive. Great job team!",
        timestamp: new Date(now - 1.5 * hour).toISOString(),
        likes: 18,
        hasLiked: false,
        replies: [],
      },
    ],
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
    commentsList: [
      {
        id: "comment-popular-1",
        author: {
          name: "David Kim",
          avatar:
            "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
        },
        text: "Your presentation was the highlight of the conference for me! Really insightful analysis on how AI is transforming our industry.",
        timestamp: new Date(now - 6 * 24 * hour).toISOString(),
        likes: 45,
        hasLiked: false,
      },
      {
        id: "comment-popular-2",
        author: {
          name: "Lisa Wang",
          avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4",
        },
        text: "Would love to discuss some of these ideas further. Are you available for a coffee chat sometime next week?",
        timestamp: new Date(now - 5 * 24 * hour).toISOString(),
        likes: 12,
        hasLiked: false,
      },
    ],
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
    commentsList: [
      {
        id: "comment-recent-1",
        author: {
          name: "Emma Thompson",
          avatar:
            "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604",
        },
        text: "I love the color palette you're using. Very clean and modern!",
        timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
        likes: 2,
        hasLiked: false,
        replies: [
          {
            id: "reply-recent-1-1",
            author: {
              name: "James Wilson",
              avatar:
                "https://images.unsplash.com/photo-1517841905240-472988babdf9",
            },
            text: "Thanks Emma! I was inspired by our brand guidelines but wanted to freshen things up a bit.",
            timestamp: new Date(now - 30 * 60 * 1000).toISOString(),
            likes: 1,
            hasLiked: false,
          },
        ],
      },
      {
        ...sampleComments[3],
        replies: [],
      },
    ],
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
    commentsList: [
      {
        id: "comment-trending2-1",
        author: {
          name: "Carlos Mendez",
          avatar:
            "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61",
        },
        text: "The consistency across components is impressive. Are you planning to make this open source?",
        timestamp: new Date(now - 3 * hour).toISOString(),
        likes: 14,
        hasLiked: false,
      },
      {
        id: "comment-trending2-2",
        author: {
          name: "Aisha Johnson",
          avatar:
            "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
        },
        text: "I really like the attention to accessibility. Great work Sarah!",
        timestamp: new Date(now - 2.5 * hour).toISOString(),
        likes: 8,
        hasLiked: false,
      },
    ],
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
    commentsList: [
      {
        id: "comment-archive-1",
        author: {
          name: "Nina Patel",
          avatar:
            "https://images.unsplash.com/photo-1601412436009-d964bd02edbc",
        },
        text: "That was such a fun day! When's the next team event?",
        timestamp: new Date(now - 29 * 24 * hour).toISOString(),
        likes: 5,
        hasLiked: false,
      },
    ],
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
