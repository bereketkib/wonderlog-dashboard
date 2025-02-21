"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { IndividualPost, postsService } from "@/services/posts";
import PostContent from "@/components/PostContent";

export default function PostPage() {
  const params = useParams();
  const [post, setPost] = useState<IndividualPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const postId = params?.id as string;
      if (!postId) {
        setError("Post ID not found");
        setLoading(false);
        return;
      }

      try {
        const data = await postsService.getPost(postId);
        setPost(data);
      } catch (error) {
        setError("Failed to load post");
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-red-500 dark:text-red-400 text-center py-8">
        {error || "Post not found"}
      </div>
    );
  }

  return <PostContent post={post} />;
}
