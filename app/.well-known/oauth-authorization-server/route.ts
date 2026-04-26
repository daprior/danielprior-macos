import { NextResponse } from "next/server";

const SITE_URL = "https://macos.maenababneh.dev";

const OAUTH_AUTHORIZATION_SERVER = {
  issuer: SITE_URL,
  authorization_endpoint: `${SITE_URL}/oauth/authorize`,
  token_endpoint: `${SITE_URL}/oauth/token`,
  jwks_uri: `${SITE_URL}/.well-known/jwks.json`,
  grant_types_supported: [
    "authorization_code",
    "client_credentials",
    "refresh_token",
  ],
  token_endpoint_auth_methods_supported: [
    "client_secret_post",
    "private_key_jwt",
  ],
  response_types_supported: ["code"],
  scopes_supported: ["projects:read", "profile:read"],
};

export function GET() {
  return NextResponse.json(OAUTH_AUTHORIZATION_SERVER, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
