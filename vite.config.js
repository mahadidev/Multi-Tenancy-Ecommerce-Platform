import react from "@vitejs/plugin-react-swc";
import fs from "fs";
import laravel from "laravel-vite-plugin";
import { defineConfig } from "vite";
import { ThemesJson } from "./resources/js/themes/themes";

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
        {
            name: "postbuild-commands",
            closeBundle: () => {
                fs.writeFileSync(
                    "resources/js/themes/theme.json",
                    JSON.stringify(ThemesJson, null, 2)
                );
            },
        },
    ],
});
