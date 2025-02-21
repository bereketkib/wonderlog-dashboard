import api from "@/services/api";

export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  viewCount: number;
  _count: {
    comments: number;
  };
}

export interface IndividualPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  viewCount: number;
  author: {
    id: string;
    name: string;
  };
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
    };
  }>;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  postId: string;
  authorId: string;
  author: {
    id: string;
    name: string;
  };
  post: {
    // Remove optional (?) from post
    id: string;
    title: string;
  };
}

export interface PaginatedComments {
  comments: Comment[]; // Using the updated Comment interface
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    hasMore: boolean;
  };
}

export interface PaginatedPosts {
  posts: Post[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    hasMore: boolean;
  };
}

// Add new interface for dashboard stats
export interface DashboardStats {
  posts: {
    total: number;
    published: number;
    draft: number;
  };
  comments: {
    total: number;
    recent: number;
  };
  views: {
    total: number;
    today: number;
  };
  recentPosts: Array<{
    id: string;
    title: string;
    createdAt: string;
    views: number;
    commentsCount: number;
    published: boolean;
  }>;
}

// Add these methods to your postsService object
export const postsService = {
  getDashboardStats: async () => {
    const response = await api.get<DashboardStats>("/posts/my/dashboard-stats");
    return response.data;
  },

  getPosts: async (
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    sort = "newest"
  ): Promise<PaginatedPosts> => {
    const response = await api.get<PaginatedPosts>(
      `/posts/my?page=${page}&limit=${limit}&search=${search}&status=${status}&sort=${sort}`
    );
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/my/${id}`);
  },

  getPost: async (id: string): Promise<IndividualPost> => {
    const response = await api.get<IndividualPost>(`/posts/my/${id}`);
    return response.data;
  },

  createPost: async (data: {
    title: string;
    content: string;
    published: boolean;
  }) => {
    const response = await api.post<Post>("/posts/my", data);
    return response.data;
  },

  updatePost: async (
    id: string,
    data: { title: string; content: string; published: boolean }
  ) => {
    const response = await api.put<Post>(`/posts/my/${id}`, data);
    return response.data;
  },
};
