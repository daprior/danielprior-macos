import { NextResponse } from "next/server";

const SITE_URL = "https://macos.maenababneh.dev";

const OAUTH_PROTECTED_RESOURCE = {
  resource: `${SITE_URL}/api`,
  authorization_servers: [SITE_URL],
  scopes_supported: ["projects:read", "profile:read"],
  bearer_methods_supported: ["header"],
};

export function GET() {
  return NextResponse.json(OAUTH_PROTECTED_RESOURCE, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
