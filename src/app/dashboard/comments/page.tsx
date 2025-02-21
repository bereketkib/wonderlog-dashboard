"use client";

import { useState, useEffect } from "react";
import { Comment, commentsService } from "@/services/comments";
import { postsService } from "@/services/posts";
import {
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  LinkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import Select from "react-select";

interface SelectOption {
  value: string;
  label: string;
}

interface PostOption {
  id: string;
  title: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [selectedPostId, setSelectedPostId] = useState<string>("");
  const [posts, setPosts] = useState<Array<{ id: string; title: string }>>([]);
  const [selectedComments, setSelectedComments] = useState<Set<string>>(
    new Set()
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectStyles = {
    control: (base: Record<string, unknown>) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: "rgb(229 231 235)", // gray-200
      borderRadius: "0.5rem",
      padding: "1px",
      "&:hover": {
        borderColor: "rgb(156 163 175)", // gray-400
      },
      boxShadow: "none",
      "&:focus-within": {
        borderColor: "rgb(139 92 246)", // purple-500
        boxShadow: "0 0 0 1px rgb(139 92 246)",
      },
      ".dark &": {
        backgroundColor: "rgb(31 41 55)", // gray-800
        borderColor: "rgb(55 65 81)", // gray-700
        "&:hover": {
          borderColor: "rgb(75 85 99)", // gray-600
        },
      },
    }),
    option: (
      base: Record<string, unknown>,
      state: { isSelected: boolean; isFocused: boolean }
    ) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "rgb(139 92 246)" // purple-500
        : state.isFocused
        ? "rgb(243 244 246)" // gray-100
        : "transparent",
      color: state.isSelected ? "white" : "rgb(17 24 39)", // gray-900
      cursor: "pointer",
      "&:active": {
        backgroundColor: "rgb(124 58 237)", // purple-600
      },
      ".dark &": {
        backgroundColor: state.isSelected
          ? "rgb(139 92 246)" // purple-500
          : state.isFocused
          ? "rgba(55 65 81 / 0.5)" // gray-700/50
          : "transparent",
        color: state.isSelected ? "white" : "rgb(243 244 246)", // gray-100
      },
    }),
    menu: (base: Record<string, unknown>) => ({
      ...base,
      backgroundColor: "white",
      borderColor: "rgb(229 231 235)", // gray-200
      borderRadius: "0.5rem",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      ".dark &": {
        backgroundColor: "rgb(31 41 55)", // gray-800
        borderColor: "rgb(55 65 81)", // gray-700
      },
    }),
    singleValue: (base: Record<string, unknown>) => ({
      ...base,
      color: "rgb(17 24 39)", // gray-900
      ".dark &": {
        color: "white",
      },
    }),
    input: (base: Record<string, unknown>) => ({
      ...base,
      color: "rgb(17 24 39)", // gray-900
      ".dark &": {
        color: "white",
      },
    }),
    placeholder: (base: Record<string, unknown>) => ({
      ...base,
      color: "rgb(156 163 175)", // gray-400
      ".dark &": {
        color: "rgb(156 163 175)", // gray-400
      },
    }),
    dropdownIndicator: (base: Record<string, unknown>) => ({
      ...base,
      color: "rgb(156 163 175)", // gray-400
      "&:hover": {
        color: "rgb(107 114 128)", // gray-500
      },
      ".dark &": {
        color: "rgb(156 163 175)", // gray-400
        "&:hover": {
          color: "rgb(209 213 219)", // gray-300
        },
      },
    }),
    clearIndicator: (base: Record<string, unknown>) => ({
      ...base,
      color: "rgb(156 163 175)", // gray-400
      "&:hover": {
        color: "rgb(107 114 128)", // gray-500
      },
      ".dark &": {
        color: "rgb(156 163 175)", // gray-400
        "&:hover": {
          color: "rgb(209 213 219)", // gray-300
        },
      },
    }),
  };

  const toggleCommentSelection = (commentId: string) => {
    const newSelection = new Set(selectedComments);
    if (newSelection.has(commentId)) {
      newSelection.delete(commentId);
    } else {
      newSelection.add(commentId);
    }
    setSelectedComments(newSelection);
  };

  const handleDelete = async () => {
    if (selectedComments.size === 0) return;
    setIsDeleting(true);

    try {
      if (selectedComments.size === 1) {
        const commentId = Array.from(selectedComments)[0];
        await commentsService.deleteComment(commentId);
      } else {
        await commentsService.deleteMultipleComments(
          Array.from(selectedComments)
        );
      }

      setComments(
        comments.filter((comment) => !selectedComments.has(comment.id))
      );
      setSelectedComments(new Set());
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete comments");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchPosts();
        await fetchComments();
      } catch (error) {
        console.error("Failed to load comments:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sort, selectedPostId, search]);

  const fetchPosts = async () => {
    try {
      const data = await postsService.getPosts();
      setPosts(data.posts.map((post) => ({ id: post.id, title: post.title })));
    } catch (error) {
      console.error("Failed to load posts");
      setPosts([]);
      throw error;
    }
  };

  const fetchComments = async () => {
    try {
      const data = selectedPostId
        ? await commentsService.getPostComments(selectedPostId, {
            sort,
            search: search || undefined,
          })
        : await commentsService.getComments({
            sort,
            search: search || undefined,
          });
      setComments(data.comments || []);
      setError("");
    } catch (error) {
      setComments([]);
      throw error;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetchComments();
    } catch (error) {
      console.error("Failed to search comments:", error);
      setError("Failed to search comments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 h-24 rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 text-center py-8">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Comments
        </h1>
        {selectedComments.size > 0 && (
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <TrashIcon className="w-5 h-5 mr-2" />
            Delete Selected ({selectedComments.size})
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 max-w-[64rem]">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search comments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full pr-4 py-2 border rounded-lg dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </form>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <Select
              value={
                selectedPostId
                  ? posts.find((post) => post.id === selectedPostId)
                  : null
              }
              onChange={(option: PostOption | null) =>
                setSelectedPostId(option?.id || "")
              }
              options={posts}
              getOptionLabel={(option: PostOption) => option.title}
              getOptionValue={(option: PostOption) => option.id}
              isClearable
              placeholder="All Posts"
              className="w-96"
              styles={selectStyles}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#8b5cf6",
                },
              })}
            />
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={{
                value: sort,
                label: sort === "newest" ? "Newest First" : "Oldest First",
              }}
              onChange={(option: SelectOption | null) =>
                setSort((option?.value as "newest" | "oldest") || "newest")
              }
              options={[
                { value: "newest", label: "Newest First" },
                { value: "oldest", label: "Oldest First" },
              ]}
              className="w-64"
              styles={selectStyles}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: "#8b5cf6",
                },
              })}
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedComments.has(comment.id)}
                  onChange={() => toggleCommentSelection(comment.id)}
                  className="mt-1 rounded dark:bg-gray-700"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment.author.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      commented on
                    </span>
                    <Link
                      href={`/dashboard/posts/${comment.post.id}`}
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1"
                    >
                      {comment.post.title}
                      <LinkIcon className="w-4 h-4" />
                    </Link>
                  </div>
                  <div
                    className="prose dark:prose-invert max-w-none text-sm"
                    dangerouslySetInnerHTML={{ __html: comment.content }}
                  />
                  <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedComments(new Set([comment.id]));
                    setIsDeleteModalOpen(true);
                  }}
                  className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No comments found.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          isDeleteModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } transition-opacity duration-300`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 ">
          <div
            className={`absolute inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity ${
              isDeleteModalOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
          />
        </div>

        <div
          className={`relative bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all max-w-lg w-full m-4 ${
            isDeleteModalOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95"
          }`}
        >
          <div className="sm:flex flex-col gap-6 sm:items-start">
            <div className="flex items-center gap-2">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                  id="modal-title"
                >
                  Delete Comments
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete{" "}
                    {selectedComments.size === 1
                      ? "this comment"
                      : "these comments"}
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full mt-5 sm:mt-4 sm:flex sm:flex-row-reverse items-center justify-start gap-3 pr-6">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm dark:hover:bg-red-700"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
