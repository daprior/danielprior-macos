import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "unsupported_grant_type",
      error_description:
        "OAuth token issuance is not enabled for this public portfolio API.",
    },
    {
      status: 501,
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
