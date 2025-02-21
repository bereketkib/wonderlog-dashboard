"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useCallback } from "react";
import {
  HomeIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  Bars3Icon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/error");
    }
  }, [user, loading, router]);

  const handleBackToWeb = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const webAppUrl = process.env.NEXT_PUBLIC_WEB_URL;
    const token = localStorage.getItem("accessToken");
    const userData = localStorage.getItem("user");
    const theme = localStorage.getItem("theme");

    window.location.href = `${webAppUrl}/api/auth/transfer?token=${encodeURIComponent(
      token || ""
    )}&user=${encodeURIComponent(userData || "")}&theme=${encodeURIComponent(
      theme || "light"
    )}`;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center my-4 justify-end gap-10 pr-2 min-h-12">
            <h1
              className={`text-purple-600 dark:text-purple-400 transition-opacity duration-300 delay-1000 ${
                isSidebarOpen ? "opacity-100" : "opacity-0 w-0 hidden"
              }`}
            >
              <span className="text-xl font-black tracking-tight">
                WONDERLOG
              </span>
              <br />
              <span className="text-base font-black tracking-widest">
                CREATOR HUB
              </span>
            </h1>
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? (
                <XMarkIcon className="w-6 h-6" strokeWidth={4} />
              ) : (
                <Bars3Icon className="w-6 h-6 mt-3 mb-11" strokeWidth={4} />
              )}
            </button>
          </div>
          {isSidebarOpen && (
            <hr className="mb-6 shadow-sm shadow-gray-400/25" />
          )}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center px-2 py-3 rounded-lg transition-colors min-w-[48px] justify-center lg:justify-start ${
                pathname === "/dashboard"
                  ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              }`}
              title="Dashboard"
            >
              <HomeIcon className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
              <span
                className={`ml-3 transition-opacity duration-300 ${
                  isSidebarOpen ? "opacity-100" : "opacity-0 w-0 hidden"
                }`}
              >
                Dashboard
              </span>
            </Link>

            <Link
              href="/dashboard/posts"
              className={`flex items-center px-2 py-3 rounded-lg transition-colors min-w-[48px] justify-center lg:justify-start ${
                pathname.startsWith("/dashboard/posts")
                  ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              }`}
              title="Posts"
            >
              <DocumentTextIcon
                className="w-6 h-6 flex-shrink-0"
                strokeWidth={2.5}
              />
              <span
                className={`ml-3 transition-opacity duration-300 ${
                  isSidebarOpen ? "opacity-100" : "opacity-0 w-0 hidden"
                }`}
              >
                Posts
              </span>
            </Link>

            <Link
              href="/dashboard/comments"
              className={`flex items-center px-2 py-3 rounded-lg transition-colors min-w-[48px] justify-center lg:justify-start ${
                pathname.startsWith("/dashboard/comments")
                  ? "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-purple-900/20"
              }`}
              title="Comments"
            >
              <ChatBubbleLeftRightIcon
                className="w-6 h-6 flex-shrink-0"
                strokeWidth={2.5}
              />
              <span
                className={`ml-3 transition-opacity duration-300 ${
                  isSidebarOpen ? "opacity-100" : "opacity-0 w-0 hidden"
                }`}
              >
                Comments
              </span>
            </Link>
          </nav>
        </div>
      </aside>

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-16"
        }`}
      >
        <header className="fixed top-0 right-0 left-0 z-30 bg-white dark:bg-gray-800 shadow-sm px-6 py-4 transition-all duration-300 mb-6">
          <div
            className={`flex items-center justify-end gap-6 ${
              isSidebarOpen ? "lg:mr-0" : "lg:mr-0"
            } transition-all duration-300`}
          >
            <a
              href="#"
              onClick={handleBackToWeb}
              className="flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Wonderlog
            </a>
            <ThemeToggle />
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          </div>
        </header>

        <main className="bg-white dark:bg-gray-800 rounded-xl shadow-sm px-6 pb-6 pt-12 mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
