import serverlessChromium from "@sparticuz/chromium";
import { chromium } from "playwright-core";

const HTTP_PROTOCOLS = new Set(["http:", "https:"]);

export async function fetchRawHtml(url: string): Promise<string> {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("A valid URL is required.");
  }

  if (!HTTP_PROTOCOLS.has(parsedUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  const isVercel = process.env.VERCEL === "1";

  if (isVercel) {
    serverlessChromium.setGraphicsMode = false;
  }

  const browser = await chromium.launch(
    isVercel
      ? {
          args: serverlessChromium.args,
          executablePath: await serverlessChromium.executablePath(),
          headless: true,
        }
      : { headless: true },
  );

  try {
    const page = await browser.newPage();
    const response = await page.goto(parsedUrl.toString(), {
      waitUntil: "domcontentloaded",
    });

    if (!response?.ok()) {
      throw new Error(
        `Failed to fetch URL: ${response?.status() ?? "unknown"} ${response?.statusText() ?? ""}`.trim(),
      );
    }

    try {
      return await page.content();
    } catch {
      return response.text();
    }
  } finally {
    await browser.close();
  }
}
