import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const userData = searchParams.get("user");
  const theme = searchParams.get("theme");

  if (!token || !userData) {
    return NextResponse.redirect(new URL("/error", request.url));
  }

  try {
    const user = JSON.parse(userData);
    if (user.role !== "AUTHOR") {
      throw new Error("Only authors can access the dashboard");
    }

    const sanitizedUserData = JSON.stringify(userData)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e");

    const script = `
      try {
        localStorage.clear();
        localStorage.setItem('accessToken', '${token}');
        localStorage.setItem('user', ${sanitizedUserData});
        localStorage.setItem('theme', '${theme || "light"}');
        
        if ("${theme}" === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }

        window.location.href = '/dashboard';
      } catch (err) {
        console.error('Transfer error:', err);
        window.location.href = '/error';
      }
    `;

    return new NextResponse(
      `<!DOCTYPE html><html><head><title>Redirecting...</title></head><body><script>${script}</script></body></html>`,
      {
        headers: {
          "Content-Type": "text/html",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err) {
    console.error("Transfer error:", err);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
