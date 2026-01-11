import type { MiddlewareHandler } from "hono";

export const handleRedirects: MiddlewareHandler = async (c, next) => {
  console.log("handle redirect middleware");
  const path = c.req.path;

  // 1. If it ends in .html, strip it
  if (path.endsWith(".html")) {
    const cleanPath = path.replace(/\.html$/, "");
    const finalPath = cleanPath.endsWith("/index")
      ? cleanPath.replace(/\/index$/, "")
      : cleanPath;
    return c.redirect(finalPath || "/", 301);
  }

  // 2. If it's a "clean" path ending in /index, redirect to the folder
  if (path.endsWith("/index")) {
    return c.redirect(path.replace(/\/index$/, "") || "/", 301);
  }

  // 3. Remove trailing slash
  if (path.length > 1 && path.endsWith("/")) {
    return c.redirect(path.slice(0, -1), 301);
  }

  await next();
};
