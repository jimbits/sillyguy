import type { MiddlewareHandler } from "hono";
import { serveStatic } from "hono/bun";

export const handleRewrites: MiddlewareHandler = async (c, next) => {
  console.log("handleRewrites");
  const url = new URL(c.req.url);

  if (
    !url.pathname.includes(".") &&
    url.pathname !== "/" &&
    !url.pathname.startsWith("/api")
  ) {
    // Note: serveStatic returns a middleware handler, so we execute it with (c, next)
    return serveStatic({ path: `./public${url.pathname}.html` })(c, next);
  }

  await next();
};
