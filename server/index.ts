import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { handleRedirects } from "./middleware/redirects";
import { handleRewrites } from "./middleware/old.rewrites";

const app = new Hono();

/**
       MIDDLEWARES
     handleRedirects:  map /path and or /path.html to just /path
     handleRewrites:  writes files with .html extension to / or /path
 */
app.use("/*", handleRedirects);
app.use("/*", handleRewrites);

// app.get("/api/data", (c) => c.json({ success: true }));
// app.get("/profile/:username", (c) => {
//   return c.html(`<h1>User: ${c.req.param("username")}</h1>`);
// });

// --- ADD THIS LINE ---
// This handles any file in /public that wasn't caught by your .html rewrites
// (e.g., /css/global.css, /images/logo.png)
app.use("/*", serveStatic({ root: "./public" }));
/**
 *        404 HANDLER
 *    The ultimate fallback
 */
app.notFound(async (c) => {
  try {
    // This works in both Vite (Node-env) and Bun (Prod)
    const fileContent = await Bun.file("./public/404.html").text();
    return c.html(fileContent, 404);
  } catch (e) {
    return c.text("404 Not Found", 404);
  }
});

export default app;
if (import.meta.main) {
  Bun.serve({
    port: 5000,
    fetch: app.fetch,
  });
  console.log("Server running on http://localhost:5000");
}
