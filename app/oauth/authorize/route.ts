import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      error: "not_implemented",
      error_description:
        "OAuth authorization endpoint is declared for discovery and not enabled in this public portfolio.",
    },
    {
      status: 501,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
