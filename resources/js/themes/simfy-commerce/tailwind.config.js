import colors from "tailwindcss/colors";
import { themePath } from "./env";

module.exports = {
    content: [`./resources/js/themes/simfy-commerce/**/*.{ts,tsx,mdx}`],
    theme: {
        container: {
            center: true,
        },
        extend: {
            colors: {
                primary: "#FFC100",
                "primary-hover": "#ffae00",
                secondary: "#360B4C",
                third: "#FF2B83",
            },
            boxShadow: {
                lg: "rgb(0 0 0 / 0%) 0px 0px, rgb(0 0 0 / 0%) 0px 0px, rgb(0 0 0 / 6%) 0px 34px 68px",
            },
        },
    },
    plugins: [],
};
