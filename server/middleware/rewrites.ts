import type { MiddlewareHandler } from "hono";
import { serveStatic } from "hono/bun";

export const handleRewrites: MiddlewareHandler = async (c, next) => {
  console.log("handleRewrites - path:", c.req.path);
  const url = new URL(c.req.url);
  const path = url.pathname;

  // Skip if it's an API route, has an extension, or is root
  if (path.startsWith("/api") || path.includes(".") || path === "/") {
    await next();
    return;
  }

  // Try two patterns:
  // 1. /contact -> /contact.html (file in root)
  // 2. /login -> /login/index.html (folder with index)

  const patterns = [
    `./public${path}.html`, // Pattern 1: e.g., /contact.html
    `./public${path}/index.html`, // Pattern 2: e.g., /login/index.html
  ];

  for (const htmlPath of patterns) {
    try {
      console.log("Trying to serve:", htmlPath);
      // Check if file exists
      const file = Bun.file(htmlPath);
      if (await file.exists()) {
        return serveStatic({ path: htmlPath })(c, next);
      }
    } catch (e) {
      // Continue to next pattern
    }
  }

  console.log("No matching HTML file found, continuing...");
  await next();
};
