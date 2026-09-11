# PageSift

PageSift fetches web pages with Playwright and uses any OpenAI-compatible model to extract user-defined fields as structured JSON.

## Setup

```bash
npm install
npx playwright install
```

Create `.env.local` with credentials for any provider that supports the OpenAI chat completions API:

```env
AI_API_KEY=your_api_key_here
AI_MODEL=gpt-4o-mini
# Optional: omit for OpenAI, or set another compatible provider endpoint.
AI_BASE_URL=https://api.openai.com/v1
```

The application always uses the `openai` npm client. Change `AI_BASE_URL` and
`AI_MODEL` to use another provider without changing the application code.

## Terminal Usage

Pass a URL and one or more comma-separated fields:

```bash
npm run extract -- \
  --url https://cloud.google.com/learn/what-is-artificial-intelligence \
  --fields title,description
```

The command returns JSON:

```json
{
  "title": "What is Artificial Intelligence (AI)? | Google Cloud",
  "description": "..."
}
```

## API

Start the development server:

```bash
npm run dev
```

Send a `POST` request to `/api/extract`:

```bash
curl -X POST http://localhost:3000/api/extract \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://cloud.google.com/learn/what-is-artificial-intelligence",
    "fields": ["title", "description"]
  }'
```

## Structure

- `lib/extraction.ts`: loads a URL and returns HTML
- `lib/request.ts`: maps requested fields with an OpenAI-compatible model
- `scripts/extract.ts`: terminal interface
- `app/api/extract/route.ts`: HTTP API
