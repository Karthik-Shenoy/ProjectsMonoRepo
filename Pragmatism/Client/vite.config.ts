import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@src": path.resolve(__dirname, "./src"),
            "@shadcn": path.resolve(__dirname, "./shadcn"),
        },
    },
    define: {
        __API_URL__: JSON.stringify(mode == "development" ? "http://127.0.0.1:3000" : ""),
    },
}));
