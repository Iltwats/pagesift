import { NextResponse } from "next/server";
import { extractFields, type ExtractionRequest } from "../../../lib/request";

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

	try {
		const result = await extractFields(body);
		return NextResponse.json(result);
	} catch (error) {
		const message = error instanceof Error ? error.message : "Extraction failed.";
		const status = message.includes("required") || message.includes("valid")
			? 400
			: 500;

		return NextResponse.json({ error: message }, { status });
	}
}
