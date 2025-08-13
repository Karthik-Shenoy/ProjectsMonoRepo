import { defineConfig } from "vite";

export default defineConfig({
  test: {
    maxWorkers: "100%", // Use all available CPU cores
    environment: "node", // or "jsdom" for browser-like tests
    reporters: "verbose", // Use verbose reporter for detailed output
    deps: {
      optimizer: {
        esbuildOptions: {
          target: "esnext", // Set the ES target version
          format: "esm", // Output as ESM
          platform: "node", // Ensure compatibility with Node.js
        },
      },
    },
  },
});
