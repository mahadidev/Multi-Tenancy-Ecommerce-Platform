import colors from "tailwindcss/colors";

module.exports = {
    content: ["./resources/js/themes/**/*.{ts,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                primary: colors.blue,
            },
            container: {
                center: true,
            },
        },
    },
};
