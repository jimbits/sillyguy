import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { getHTMLFile } from "./lib/utils/notFound";
import { html, raw } from "hono/html";
const app = new Hono();

// 1. Serve the index.html specifically for the root route
app.use("/*", async (c, next) => {
  // If the path doesn't have an extension (like .html or .css)
  // and isn't the root, try appending .html
  const url = new URL(c.req.url);
  if (!url.pathname.includes(".") && url.pathname !== "/") {
    // We don't actually change the browser URL,
    // we just tell Hono which file to look for.
    return serveStatic({ path: `./public${url.pathname}.html` })(c, next);
  }
  await next();
});
// Fallback for general assets
app.use("/*", serveStatic({ root: "./public" }));
app.get("/api", async (c) => {
  return c.json({ apiVersion: "ver-1", paths: "full" });
});
// 4. Custom 404 Handler

app.notFound(async (c) => {
  const htmlFile = await getHTMLFile("./public/404.html");

  return c.html(htmlFile, 404);
});
export default {
  port: 5000,
  fetch: app.fetch,
};
