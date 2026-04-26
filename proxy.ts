import { NextRequest, NextResponse } from "next/server";

const HOMEPAGE_LINK_HEADERS = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json;version=3.1"',
  '</docs/api>; rel="service-doc"',
  '</.well-known/openid-configuration>; rel="describedby"; type="application/json"',
  '</.well-known/openid-configuration>; rel="openid-configuration"',
  '</.well-known/oauth-authorization-server>; rel="oauth-authorization-server"',
  '</.well-known/oauth-protected-resource>; rel="oauth-protected-resource"',
  '</.well-known/mcp/server-card.json>; rel="mcp-server"',
  '</.well-known/agent-skills/index.json>; rel="agent-skills"',
];

function withAgentHeaders(response: NextResponse) {
  for (const header of HOMEPAGE_LINK_HEADERS) {
    response.headers.append("Link", header);
  }

  response.headers.append("Vary", "Accept");
  return response;
}

export function proxy(request: NextRequest) {
  const acceptHeader = request.headers.get("accept")?.toLowerCase() ?? "";
  const wantsMarkdown = acceptHeader.includes("text/markdown");

  if (wantsMarkdown) {
    const url = request.nextUrl.clone();
    url.pathname = "/agent-markdown";
    return withAgentHeaders(NextResponse.rewrite(url));
  }

  return withAgentHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/"],
};
