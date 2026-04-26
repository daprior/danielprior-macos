import { NextResponse } from "next/server";

const SITE_URL = "https://macos.maenababneh.dev";

const API_CATALOG = {
  linkset: [
    {
      anchor: `${SITE_URL}/api`,
      "service-desc": [
        {
          href: `${SITE_URL}/openapi.json`,
          type: "application/vnd.oai.openapi+json;version=3.1",
        },
      ],
      "service-doc": [
        {
          href: `${SITE_URL}/docs/api`,
          type: "text/html",
        },
      ],
      status: [
        {
          href: `${SITE_URL}/api/health`,
          type: "application/json",
        },
      ],
    },
  ],
};

export function GET() {
  return new NextResponse(JSON.stringify(API_CATALOG, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
