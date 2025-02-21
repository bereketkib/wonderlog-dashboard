"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IndividualPost, postsService } from "@/services/posts";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface PostContentProps {
  post: IndividualPost;
}

export default function PostContent({ post }: PostContentProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await postsService.deletePost(post.id);
      router.push("/dashboard/posts");
    } catch (error) {
      setError("Failed to delete post");
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="text-red-500 dark:text-red-400 text-center py-8">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Post Header */}
        <div className="fixed z-30 top-40 right-40 flex w-full items-center justify-end gap-3">
          <Link
            href={`/dashboard/posts/${post.id}/edit`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <PencilSquareIcon className="w-4 h-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-lg hover:bg-red-50 hover:shadow-sm transition-all dark:bg-gray-800 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
          >
            <TrashIcon className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {post.title}
            </h1>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <EyeIcon className="w-4 h-4" />
              {post.viewCount} views
            </div>
            <div className="flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              {post.comments.length} comments
            </div>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                post.published
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {post.published ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        {/* Post Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="prose dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-5 h-5" />
            Comments ({post.comments.length})
          </h2>

          {post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <UserCircleIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white block">
                        {comment.author.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="prose dark:prose-invert max-w-none pl-11">
                    <div
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No comments yet.</p>
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
        <div className="fixed inset-0">
          {/* Background overlay */}
          <div
            className={`absolute inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity ${
              isDeleteModalOpen ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden="true"
            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
          />
        </div>

        {/* Modal panel */}
        <div
          className={`relative bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all max-w-lg w-full m-4 ${
            isDeleteModalOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95"
          }`}
        >
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                id="modal-title"
              >
                Delete Post
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this post? This action cannot
                  be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
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
    </>
  );
}
