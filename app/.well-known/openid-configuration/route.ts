import { NextResponse } from "next/server";

const SITE_URL = "https://macos.maenababneh.dev";

const OPENID_CONFIGURATION = {
  issuer: SITE_URL,
  authorization_endpoint: `${SITE_URL}/oauth/authorize`,
  token_endpoint: `${SITE_URL}/oauth/token`,
  jwks_uri: `${SITE_URL}/.well-known/jwks.json`,
  response_types_supported: ["code"],
  subject_types_supported: ["public"],
  id_token_signing_alg_values_supported: ["RS256"],
  grant_types_supported: [
    "authorization_code",
    "client_credentials",
    "refresh_token",
  ],
  scopes_supported: ["openid", "profile", "projects:read"],
};

export function GET() {
  return NextResponse.json(OPENID_CONFIGURATION, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
