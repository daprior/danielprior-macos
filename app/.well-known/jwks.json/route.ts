import { NextResponse } from "next/server";

const JWKS = {
  keys: [],
};

export function GET() {
  return NextResponse.json(JWKS, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    },
  });
}
