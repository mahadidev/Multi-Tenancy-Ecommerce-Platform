import flowbite from "flowbite-react/tailwind";
import colors from "tailwindcss/colors";

module.exports = {
    content: ["./resources/js/seller/**/*.{ts,tsx,mdx}", flowbite.content()],
    theme: {
        extend: {
            colors: {
                primary: colors.blue,
            },
        },
    },
    plugins: [flowbite.plugin()],
};
