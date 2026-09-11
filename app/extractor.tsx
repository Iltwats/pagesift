"use client";

import { FormEvent, KeyboardEvent, useMemo, useState } from "react";

type ExtractionResult = Record<string, string | null>;

const SUGGESTED_FIELDS = ["title", "description", "price", "author"];

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 10h12m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" fill="none">
      <path
        d="m4 4 8 8m0-8-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" fill="none">
      <rect x="6.5" y="6.5" width="8" height="8" rx="1.5" stroke="currentColor" />
      <path
        d="M11.5 6.5V4.8a1.3 1.3 0 0 0-1.3-1.3H4.8a1.3 1.3 0 0 0-1.3 1.3v5.4a1.3 1.3 0 0 0 1.3 1.3h1.7"
        stroke="currentColor"
      />
    </svg>
  );
}

export function Extractor() {
  const [mode, setMode] = useState<"extract" | "self-host">("extract");
  const [url, setUrl] = useState("");
  const [fields, setFields] = useState<string[]>(["title", "description"]);
  const [fieldInput, setFieldInput] = useState("");
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const prettyResult = useMemo(
    () => (result ? JSON.stringify(result, null, 2) : ""),
    [result],
  );

  const addField = (rawField: string) => {
    const field = rawField.trim();
    if (!field || fields.includes(field)) return;
    setFields((current) => [...current, field]);
    setFieldInput("");
  };

  const handleFieldKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addField(fieldInput);
    }
    if (event.key === "Backspace" && !fieldInput && fields.length) {
      setFields((current) => current.slice(0, -1));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!url.trim()) return setError("Enter a URL to extract from.");
    if (!fields.length) return setError("Add at least one field to extract.");

    setLoading(true);
    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, fields }),
      });
      const remainingHeader = response.headers.get("X-RateLimit-Remaining");
      if (remainingHeader) setRemaining(Number(remainingHeader));
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Extraction failed.");
      setResult(data);
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : "Extraction failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <main className="app-shell">
      <nav className="nav-wrap" aria-label="Main navigation">
        <a className="brand" href="#" aria-label="PageSift home">
          <span className="brand-mark">P</span>
          <span>PageSift</span>
        </a>
        <div className="nav-actions">
          <button
            className={mode === "self-host" ? "nav-link active" : "nav-link"}
            onClick={() => setMode("self-host")}
          >
            Self-host
          </button>
          <a
            className="github-link"
            href="https://github.com/Iltwats/pagesift"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="eyebrow">
          <span /> Web data, made useful
        </div>
        <h1>
          Extract what matters
          <br />
          from any webpage.
        </h1>
        <p>
          Paste a URL, choose the fields you need, and get clean, structured data in
          seconds.
        </p>
      </section>

      <section className="workspace" aria-label="PageSift extractor">
        <div className="mode-tabs" role="tablist">
          <button
            className={mode === "extract" ? "mode-tab selected" : "mode-tab"}
            onClick={() => setMode("extract")}
            role="tab"
            aria-selected={mode === "extract"}
          >
            Try it
          </button>
          <button
            className={mode === "self-host" ? "mode-tab selected" : "mode-tab"}
            onClick={() => setMode("self-host")}
            role="tab"
            aria-selected={mode === "self-host"}
          >
            Clone &amp; self-host
          </button>
        </div>

        {mode === "extract" ? (
          <form className="extract-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="page-url">Page URL</label>
              <div className="url-row">
                <input
                  id="page-url"
                  type="url"
                  placeholder="https://example.com/product"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                />
                <button className="extract-button" type="submit" disabled={loading}>
                  {loading ? (
                    <span className="spinner" />
                  ) : (
                    <>
                      Extract <ArrowIcon />
                    </>
                  )}
                </button>
              </div>
              <button
                className="url-example"
                type="button"
                onClick={() =>
                  setUrl("https://www.amazon.in/Atomic-Habits-James-Clear/dp/1847941834/")
                }
              >
                Try an example: Atomic Habits on Amazon
              </button>
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="field-input">Fields to extract</label>
                <span>Press Enter to add</span>
              </div>
              <div
                className="field-box"
                onClick={() => document.getElementById("field-input")?.focus()}
              >
                {fields.map((field) => (
                  <span className="field-chip" key={field}>
                    {field}
                    <button
                      type="button"
                      aria-label={`Remove ${field}`}
                      onClick={() =>
                        setFields((current) => current.filter((item) => item !== field))
                      }
                    >
                      <CloseIcon />
                    </button>
                  </span>
                ))}
                <input
                  id="field-input"
                  value={fieldInput}
                  placeholder={
                    fields.length ? "Add another…" : "e.g. title, price, author"
                  }
                  onChange={(event) => setFieldInput(event.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  onBlur={() => addField(fieldInput)}
                />
              </div>
              <div className="suggestions">
                <span>Suggestions</span>
                {SUGGESTED_FIELDS.filter((field) => !fields.includes(field)).map(
                  (field) => (
                    <button type="button" key={field} onClick={() => addField(field)}>
                      + {field}
                    </button>
                  ),
                )}
              </div>
            </div>

            {remaining !== null && (
              <p className="quota-note">
                {remaining} free extraction{remaining === 1 ? "" : "s"} remaining in this
                window
              </p>
            )}
            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            {(loading || result) && (
              <div className="result-panel" aria-live="polite">
                <div className="result-heading">
                  <div>
                    <span className="status-dot" />
                    <strong>
                      {loading ? "Extracting page…" : "Extraction complete"}
                    </strong>
                  </div>
                  {result && (
                    <button type="button" onClick={() => copyText(prettyResult)}>
                      <CopyIcon /> {copied ? "Copied" : "Copy JSON"}
                    </button>
                  )}
                </div>
                {loading ? (
                  <div className="result-loading">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : (
                  <pre>{prettyResult}</pre>
                )}
              </div>
            )}
          </form>
        ) : (
          <div className="self-host-panel">
            <div className="self-host-copy">
              <div className="code-icon">&lt;/&gt;</div>
              <div>
                <h2>Make PageSift your own</h2>
                <p>
                  Clone the project, add your AI provider key, and run as many extractions
                  as your infrastructure allows.
                </p>
              </div>
            </div>
            <ol className="steps">
              <li>
                <span>1</span>
                <div>
                  <strong>Clone the repository</strong>
                  <code>git clone https://github.com/Iltwats/pagesift.git</code>
                </div>
              </li>
              <li>
                <span>2</span>
                <div>
                  <strong>Configure your model</strong>
                  <code>cp .env.example .env.local</code>
                </div>
              </li>
              <li>
                <span>3</span>
                <div>
                  <strong>Install and run</strong>
                  <code>npm install &amp;&amp; npm run dev</code>
                </div>
              </li>
            </ol>
            <button
              className="copy-command"
              type="button"
              onClick={() =>
                copyText("git clone https://github.com/Iltwats/pagesift.git")
              }
            >
              <CopyIcon /> {copied ? "Copied" : "Copy clone command"}
            </button>
          </div>
        )}
      </section>

      <footer>
        <span>Free to try · Rate limited for fair use</span>
        <span>Open source</span>
      </footer>
    </main>
  );
}
