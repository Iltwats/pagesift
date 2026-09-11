export default function Home() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-zinc-950 px-6 py-16 text-zinc-100">
      <section className="w-full max-w-2xl space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-400">
            PageSift
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Turn web pages into structured data.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-400">
            Fetch an accessible URL, describe the fields you need, and receive a
            clean JSON response powered by any OpenAI-compatible model.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-medium">CLI extraction</h2>
            <code className="mt-3 block text-sm text-emerald-300">
              npm run extract -- --url URL --fields title,description
            </code>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-medium">API extraction</h2>
            <p className="mt-3 text-sm text-zinc-400">
              POST your URL and requested fields to /api/extract.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
