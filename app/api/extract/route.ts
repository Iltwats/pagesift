import { NextResponse } from "next/server";
import { extractFields, type ExtractionRequest } from "../../../lib/request";
import {
  consumeRateLimit,
  getClientIp,
  rateLimitHeaders,
  refundRateLimit,
} from "../../../lib/rate-limit";

export const runtime = "nodejs";

function isExtractionRequest(value: unknown): value is ExtractionRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const request = value as Record<string, unknown>;

  return typeof request.url === "string" && Array.isArray(request.fields);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (!isExtractionRequest(body)) {
    return NextResponse.json(
      { error: "Expected a JSON body with a url and fields array." },
      { status: 400 },
    );
  }

  const clientIp = getClientIp(request);
  const rateLimit = consumeRateLimit(clientIp);
  const headers = rateLimitHeaders(rateLimit);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error:
          "You have reached the free extraction limit. Please try again later or self-host PageSift.",
      },
      {
        status: 429,
        headers: {
          ...headers,
          "Retry-After": String(
            Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1_000)),
          ),
        },
      },
    );
  }

  try {
    const result = await extractFields(body);
    return NextResponse.json(result, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Extraction failed.";
    const upstreamStatus =
      typeof error === "object" && error && "status" in error ? Number(error.status) : 0;
    const status =
      upstreamStatus >= 400 && upstreamStatus <= 599
        ? upstreamStatus
        : message.includes("required") || message.includes("valid")
          ? 400
          : 500;
    const refunded = refundRateLimit(clientIp, rateLimit);
    const refundedHeaders = rateLimitHeaders(refunded);

    return NextResponse.json({ error: message }, { status, headers: refundedHeaders });
  }
}
