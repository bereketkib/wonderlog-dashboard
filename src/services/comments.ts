import api from "@/services/api";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  post: {
    id: string;
    title: string;
  };
}

export interface CommentsPaginatedResponse {
  comments: Comment[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    hasMore: boolean;
  };
}

export interface CommentFilters {
  page?: number;
  limit?: number;
  sort?: "newest" | "oldest";
  search?: string;
}

export const commentsService = {
  getComments: async (
    filters: CommentFilters = {}
  ): Promise<CommentsPaginatedResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.search) params.append("search", filters.search);

    const response = await api.get(`/comments/author/all?${params.toString()}`);
    return response.data;
  },

  getPostComments: async (
    postId: string,
    filters: CommentFilters = {}
  ): Promise<CommentsPaginatedResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());
    if (filters.sort) params.append("sort", filters.sort);
    if (filters.search) params.append("search", filters.search);
    const response = await api.get(
      `/comments/posts/${postId}?${params.toString()}`
    );
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },

  deleteMultipleComments: async (commentIds: string[]): Promise<void> => {
    await api.post("/comments/bulk-delete", { commentIds });
  },
};
