import { NextResponse } from "next/server";

const MARKDOWN_HOME = `# Maen Ababneh | Full Stack Web Developer

Interactive macOS-themed portfolio featuring selected work, technical skills, and contact links.

## Profile

- Name: Maen Ababneh
- Role: Full Stack Web Developer
- Website: https://macos.maenababneh.dev

## Links

- GitHub: https://github.com/maenababneh
- LinkedIn: https://www.linkedin.com/in/maenababneh/
- YouTube: https://www.youtube.com/@thecompasstech

## API Discovery

- API Catalog: https://macos.maenababneh.dev/.well-known/api-catalog
- Service Docs: https://macos.maenababneh.dev/docs/api
- OpenAPI: https://macos.maenababneh.dev/openapi.json
`;

function estimateMarkdownTokens(markdown: string) {
  return markdown.trim().split(/\s+/).filter(Boolean).length;
}

export function GET() {
  const tokens = estimateMarkdownTokens(MARKDOWN_HOME);

  return new NextResponse(MARKDOWN_HOME, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      Vary: "Accept",
      "x-markdown-tokens": String(tokens),
    },
  });
}
