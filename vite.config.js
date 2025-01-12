import react from "@vitejs/plugin-react-swc";
import laravel from "laravel-vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        laravel({
            input: [
                "resources/css/app.css",
                "resources/js/app.js",
                "resources/js/frontend/index.tsx",
                "resources/js/seller/index.tsx",
                "resources/js/themes/index.tsx",
            ],
            refresh: true,
        }),
        react({
            refresh: true,
            tsDecorators: true,
        }),
    ],
});
