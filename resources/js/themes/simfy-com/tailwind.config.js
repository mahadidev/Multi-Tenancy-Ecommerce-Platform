import flowbite from "flowbite-react/tailwind";
import colors from "tailwindcss/colors";

module.exports = {
    content: ["./resources/js/themes/simfy-com/**/*.{ts,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                primary: colors.blue,
            },
        },
    },
    plugins: [flowbite.plugin()],
};
