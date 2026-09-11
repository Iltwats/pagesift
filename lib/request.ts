import OpenAI from "openai";
import dotenv from "dotenv";
import { fetchRawHtml } from "./extraction";

dotenv.config({ path: ".env.local" });

const MAX_HTML_LENGTH = 300_000;
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/";

export interface ExtractionRequest {
	url: string;
	fields: string[];
}

export type ExtractionResult = Record<string, string | null>;

function normalizeFields(fields: string[]): string[] {
	const normalizedFields = fields
		.map((field) => field.trim())
		.filter(Boolean);

	return [...new Set(normalizedFields)];
}

export async function extractFields(
	request: ExtractionRequest,
): Promise<ExtractionResult> {
	if (!request || typeof request.url !== "string") {
		throw new Error("A URL is required.");
	}

	if (!Array.isArray(request.fields)) {
		throw new Error("Fields must be provided as an array.");
	}

	const fields = normalizeFields(request.fields);

	if (fields.length === 0) {
		throw new Error("At least one field is required.");
	}

	const apiKey = process.env.GEMINI_API_KEY;

	if (!apiKey) {
		throw new Error("GEMINI_API_KEY is required.");
	}

	const html = await fetchRawHtml(request.url);
	const client = new OpenAI({ apiKey, baseURL: GEMINI_BASE_URL });
	const completion = await client.chat.completions.create({
		model: "gemini-3.5-flash",
		messages: [
			{
				role: "system",
				content:
					`Extract only the requested fields from the supplied HTML. Return null when a field cannot be found. Do not infer values that are not supported by the HTML. Return one JSON object with exactly these keys: ${JSON.stringify(fields)}. Every value must be a string or null.`,
			},
			{
				role: "user",
				content: `Requested fields: ${JSON.stringify(fields)}\n\nHTML:\n${html.slice(0, MAX_HTML_LENGTH)}`,
			},
		],
		response_format: { type: "json_object" },
	});

	const content = completion.choices[0]?.message.content;

	if (!content) {
		throw new Error("The extraction model returned an empty response.");
	}

	const parsed = JSON.parse(content) as Record<string, unknown>;

	return Object.fromEntries(
		fields.map((field) => {
			const value = parsed[field];
			return [field, typeof value === "string" ? value : null];
		}),
	);
}
