import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Serve the standalone approved artwork without the booking layout or scripts.
export const dynamic = "force-static";

export async function GET() {
  const html = await readFile(
    join(process.cwd(), "src", "app", "closed-for-renovations", "preview.html"),
    "utf8",
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
