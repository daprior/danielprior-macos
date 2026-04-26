import { NextResponse } from "next/server";

const ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://macos.maenababneh.dev/sitemap.xml
Content-Signal: ai-train=no, search=yes, ai-input=no
`;

export function GET() {
  return new NextResponse(ROBOTS_TXT, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
