import { defineConfig } from "vite";
import devServer from "@hono/vite-dev-server";
import path from "node:path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  // Development configuration (with Vite dev server)
  if (isDev) {
    return {
      server: {
        port: 5000,
      },
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./server"),
          "@lib": path.resolve(__dirname, "./server/lib"),
          "@middleware": path.resolve(__dirname, "./server/middleware"),
        },
      },
      plugins: [
        tsconfigPaths(),
        devServer({
          entry: "server/index.ts",
          exclude: [
            /^\/ts\/.+/,
            /^\/css\/.+/,
            /^\/favicon.ico$/,
            /^\/@.+/,
            /^\/node_modules\/.+/,
            /^\/sandbox\/.+/,
          ],
        }),
      ],
    };
  }

  // Production build configuration
  return {
    build: {
      ssr: true, // Server-side build
      outDir: "dist", // Output to dist folder
      emptyOutDir: true, // Clean dist before build
      rollupOptions: {
        input: "server/index.ts", // Entry point
        output: {
          format: "esm", // ES module format
          entryFileNames: "index.js", // Output filename
        },
        external: [
          // Don't bundle these - they'll be in node_modules
          "hono",
          "hono/bun",
        ],
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./server"),
        "@lib": path.resolve(__dirname, "./server/lib"),
        "@middleware": path.resolve(__dirname, "./server/middleware"),
      },
    },
    plugins: [tsconfigPaths()],
    publicDir: "public", // Copy public folder to dist/public
  };
});
