import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      error: "not_implemented",
      message:
        "MCP transport endpoint is declared for discovery and will be enabled when server tools are exposed.",
    },
    {
      status: 501,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
