import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@shadcn-ui": path.resolve(__dirname, "./@shadcn-ui"),
        },
    },
    server: {
        host: "127.0.0.1",
        port: 5173,
    },
    base: "/demo/db-profiler",
});
