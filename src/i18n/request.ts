import type { NextRequest } from "next/server";

export default function requestConfig(request: NextRequest) {
  return {
    locale: request.nextUrl.locale ?? "en",
  };
}
