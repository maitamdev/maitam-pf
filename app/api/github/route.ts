import { NextResponse } from "next/server";

export const revalidate = 1800;

const githubHeaders = () => ({
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
});

export async function GET() {
  try {
    const [reposResponse, eventsResponse] = await Promise.all([
      fetch("https://api.github.com/users/maitamdev/repos?sort=pushed&per_page=6", {
        headers: githubHeaders(),
        next: { revalidate },
        signal: AbortSignal.timeout(8000),
      }),
      fetch("https://api.github.com/users/maitamdev/events/public?per_page=8", {
        headers: githubHeaders(),
        next: { revalidate },
        signal: AbortSignal.timeout(8000),
      }),
    ]);

    if (!reposResponse.ok || !eventsResponse.ok) {
      return NextResponse.json(
        { error: "GitHub signal unavailable" },
        { status: 502, headers: { "Cache-Control": "public, max-age=60" } },
      );
    }

    return NextResponse.json(
      {
        repos: await reposResponse.json(),
        events: await eventsResponse.json(),
        updatedAt: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "GitHub signal unavailable" },
      { status: 502, headers: { "Cache-Control": "public, max-age=60" } },
    );
  }
}
