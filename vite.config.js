import react from "@vitejs/plugin-react-swc";
import laravel from "laravel-vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.js"],
            refresh: true,
        }),
        react({
            input: [
                "resources/js/frontend/index.tsx",
                "resources/js/app/index.tsx",
            ],
        }),
    ],
});
