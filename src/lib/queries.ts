import { db } from "./db";

export async function getCategories() {
  return db.category.findMany({
    include: {
      implementations: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          website: true,
          githubUrl: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              votes: true,
              comments: true,
            },
          },
        },
      },
      _count: {
        select: {
          implementations: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getTags() {
  return db.tag.findMany({
    include: {
      _count: {
        select: {
          implementations: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.category.findUnique({
    where: { slug },
    include: {
      implementations: {
        include: {
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              votes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
}

export async function getImplementationBySlug(slug: string, userId?: string) {
  const implementation = await db.implementation.findUnique({
    where: { slug },
    include: {
      category: true,
      votes: userId
        ? {
            where: {
              userId: userId,
            },
            take: 1,
          }
        : false,
      comments: {
        where: {
          parentId: null, // Only root comments, replies will be nested
          isHidden: false, // Only show non-hidden comments
        },
        include: {
          replies: {
            where: {
              isHidden: false, // Only show non-hidden replies
            },
            include: {
              replies: {
                where: {
                  isHidden: false, // Only show non-hidden nested replies
                },
              }, // One level of nested replies
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  if (!implementation) return null;

  // Transform dates to strings for serialization
  const transformComments = (comments: any[]): any[] => {
    return comments.map((comment) => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
      replies: comment.replies ? transformComments(comment.replies) : [],
    }));
  };

  return {
    ...implementation,
    createdAt: implementation.createdAt.toISOString(),
    updatedAt: implementation.updatedAt.toISOString(),
    comments: transformComments(implementation.comments),
    category: {
      ...implementation.category,
      createdAt: implementation.category.createdAt.toISOString(),
      updatedAt: implementation.category.updatedAt.toISOString(),
    },
    _count: implementation._count,
    votes: implementation.votes,
  };
}

export interface ImplementationFilters {
  category?: string;
  tags?: string[];
  sort?: "recent" | "popular" | "trending" | "name" | "votes";
  order?: "asc" | "desc";
  limit?: number;
}

export async function getImplementations(filters: ImplementationFilters = {}) {
  const { category, tags, sort = "recent", order = "desc", limit } = filters;

  // Build where clause
  const where: any = {};
  if (category) {
    where.category = { slug: category };
  }
  if (tags && tags.length > 0) {
    where.tags = {
      some: {
        tag: {
          slug: { in: tags },
        },
      },
    };
  }

  // For sorting that requires vote calculations
  if (sort === "popular" || sort === "votes") {
    const implementations = await db.implementation.findMany({
      where,
      include: {
        category: true,
        votes: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
      },
      take: limit,
    });

    // Calculate scores and sort
    const scored = implementations.map((impl) => {
      const upvotes = impl.votes.filter((v) => v.type === "UP").length;
      const downvotes = impl.votes.filter((v) => v.type === "DOWN").length;
      const score = upvotes - downvotes;

      return {
        ...impl,
        votes: undefined, // Remove votes array from response
        voteScore: score,
      };
    });

    // const sortedField = sort === "popular" ? "voteScore" : "_count.votes";
    return scored.sort((a, b) => {
      const aValue = sort === "popular" ? a.voteScore : a._count.votes;
      const bValue = sort === "popular" ? b.voteScore : b._count.votes;
      return order === "desc" ? bValue - aValue : aValue - bValue;
    });
  }

  // For trending sort
  if (sort === "trending") {
    return getTrendingImplementations(limit || 50).then((trending) => {
      if (!category) return trending;
      return trending.filter((impl) => impl.category.slug === category);
    });
  }

  // Build orderBy clause for simple sorts
  let orderBy: any = {};
  switch (sort) {
    case "name":
      orderBy = { name: order };
      break;
    default:
      orderBy = { createdAt: order };
      break;
  }

  return db.implementation.findMany({
    where,
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
    orderBy,
    take: limit,
  });
}

export async function getFeaturedImplementations(limit = 6) {
  return db.implementation.findMany({
    take: limit,
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getTrendingImplementations(limit = 10) {
  // Get implementations with their vote scores from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return db.implementation
    .findMany({
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        votes: {
          where: {
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
        },
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
      },
      take: limit * 2, // Get more to calculate scores
    })
    .then((implementations) => {
      // Calculate trending score based on recent votes
      const scored = implementations.map((impl) => {
        const recentUpvotes = impl.votes.filter((v) => v.type === "UP").length;
        const recentDownvotes = impl.votes.filter(
          (v) => v.type === "DOWN",
        ).length;
        const score = recentUpvotes - recentDownvotes;
        const totalRecentVotes = recentUpvotes + recentDownvotes;

        // Trending score: (score * recent_activity) + total_vote_count
        const trendingScore =
          score * Math.min(totalRecentVotes, 10) + impl._count.votes;

        return {
          ...impl,
          votes: undefined, // Remove votes array from response
          trendingScore,
          recentVoteCount: totalRecentVotes,
        };
      });

      // Sort by trending score and take the limit
      return scored
        .sort((a, b) => b.trendingScore - a.trendingScore)
        .slice(0, limit);
    });
}

export async function getPopularImplementations(limit = 10) {
  // Get implementations sorted by total vote score
  return db.implementation
    .findMany({
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        votes: true,
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
      },
      take: limit * 2, // Get more to calculate scores
    })
    .then((implementations) => {
      // Calculate popularity score
      const scored = implementations.map((impl) => {
        const upvotes = impl.votes.filter((v) => v.type === "UP").length;
        const downvotes = impl.votes.filter((v) => v.type === "DOWN").length;
        const score = upvotes - downvotes;

        return {
          ...impl,
          votes: undefined, // Remove votes array from response
          popularityScore: score,
          upvotes,
          downvotes,
        };
      });

      // Sort by popularity score and take the limit
      return scored
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, limit);
    });
}

export async function getRecentImplementations(limit = 10) {
  return db.implementation.findMany({
    take: limit,
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// User dashboard queries
export async function getUserStats(userId: string) {
  const [implementationsCount, votesCount, commentsCount] = await Promise.all([
    // User's submitted implementations
    db.implementation.count({
      where: { userId },
    }),

    // User's votes
    db.vote.count({
      where: { userId },
    }),

    // User's comments
    db.comment.count({
      where: { userId },
    }),
  ]);

  return {
    implementationsCount,
    votesCount,
    commentsCount,
  };
}

export async function getUserImplementations(userId: string) {
  return db.implementation.findMany({
    where: { userId },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getVotesByUser(userId: string) {
  return db.vote.findMany({
    where: { userId },
    include: {
      implementation: {
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              votes: true,
              comments: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10, // Limit to recent votes
  });
}

export async function getCommentsByUser(userId: string) {
  return db.comment.findMany({
    where: { userId },
    include: {
      implementation: {
        select: {
          id: true,
          name: true,
          slug: true,
          category: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10, // Limit to recent comments
  });
}

// Get vote count for implementation
export async function getVoteCounts(implementationId: string) {
  const votes = await db.vote.groupBy({
    by: ["type"],
    where: { implementationId },
    _count: {
      type: true,
    },
  });

  const upVotes = votes.find((v) => v.type === "UP")?._count.type || 0;
  const downVotes = votes.find((v) => v.type === "DOWN")?._count.type || 0;

  return {
    upVotes,
    downVotes,
    totalVotes: upVotes + downVotes,
    score: upVotes - downVotes,
  };
}

// Get State of the Art implementations (100+ net votes) grouped by category
export async function getStateOfTheArtByCategory() {
  // Get all implementations with their votes
  const implementations = await db.implementation.findMany({
    include: {
      category: true,
      votes: true,
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  // Calculate net votes and filter State of the Art
  const stateOfTheArtImplementations = implementations
    .map((impl) => {
      const upvotes = impl.votes.filter((v) => v.type === "UP").length;
      const downvotes = impl.votes.filter((v) => v.type === "DOWN").length;
      const netVotes = upvotes - downvotes;
      const isStateOfTheArt = netVotes >= 100;

      return {
        ...impl,
        votes: undefined, // Remove votes array from response
        netVotes,
        upvotes,
        downvotes,
        isStateOfTheArt,
      };
    })
    .filter((impl) => impl.isStateOfTheArt);

  // Group by category
  const groupedByCategory = stateOfTheArtImplementations.reduce((acc, impl) => {
    const categoryName = impl.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = {
        category: impl.category,
        implementations: [],
      };
    }
    acc[categoryName].implementations.push(impl);
    return acc;
  }, {} as Record<string, { category: any; implementations: any[] }>);

  // Convert to array and sort implementations within each category
  const result = Object.values(groupedByCategory).map((group) => ({
    ...group,
    implementations: group.implementations.sort((a, b) => b.netVotes - a.netVotes),
  }));

  // Sort categories by name
  return result.sort((a, b) => a.category.name.localeCompare(b.category.name));
}

// Get State of the Art implementations filtered by selected technologies
export async function getStateOfTheArtFiltered(technologyNames: string[]) {
  if (technologyNames.length === 0) {
    return getStateOfTheArtByCategory();
  }

  // Get all implementations with their votes
  const implementations = await db.implementation.findMany({
    where: {
      name: {
        in: technologyNames,
      },
    },
    include: {
      category: true,
      votes: true,
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          votes: true,
          comments: true,
        },
      },
    },
  });

  // Calculate net votes and filter State of the Art
  const stateOfTheArtImplementations = implementations
    .map((impl) => {
      const upvotes = impl.votes.filter((v) => v.type === "UP").length;
      const downvotes = impl.votes.filter((v) => v.type === "DOWN").length;
      const netVotes = upvotes - downvotes;
      const isStateOfTheArt = netVotes >= 100;

      return {
        ...impl,
        votes: undefined, // Remove votes array from response
        netVotes,
        upvotes,
        downvotes,
        isStateOfTheArt,
      };
    })
    .filter((impl) => impl.isStateOfTheArt);

  // Group by category
  const groupedByCategory = stateOfTheArtImplementations.reduce((acc, impl) => {
    const categoryName = impl.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = {
        category: impl.category,
        implementations: [],
      };
    }
    acc[categoryName].implementations.push(impl);
    return acc;
  }, {} as Record<string, { category: any; implementations: any[] }>);

  // Convert to array
  const result = Object.values(groupedByCategory).map((group) => ({
    ...group,
    implementations: group.implementations.sort((a, b) => b.netVotes - a.netVotes),
  }));

  // Sort categories by name
  return result.sort((a, b) => a.category.name.localeCompare(b.category.name));
}

// Search across categories and implementations
export async function searchAll(query: string) {
  const searchTerm = query.toLowerCase();

  const [categories, implementations] = await Promise.all([
    // Search categories
    db.category.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
        ],
      },
      include: {
        _count: {
          select: {
            implementations: true,
          },
        },
        implementations: {
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                votes: true,
              },
            },
          },
          take: 3, // Top 3 implementations per category
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    }),

    // Search implementations
    db.implementation.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { description: { contains: searchTerm } },
          { category: { name: { contains: searchTerm } } },
          { tags: { some: { tag: { name: { contains: searchTerm } } } } },
        ],
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            votes: true,
            comments: true,
          },
        },
      },
      orderBy: [{ createdAt: "desc" }],
    }),
  ]);

  return {
    categories,
    implementations,
    query: searchTerm,
    totalResults: categories.length + implementations.length,
  };
}
