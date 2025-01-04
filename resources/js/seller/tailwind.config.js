import flowbite from "flowbite-react/tailwind";

module.exports = {
    content: ["./resources/js/seller/**/*.{ts,tsx,mdx}", flowbite.content()],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#268844",
                    50: "#f2f9f4",
                    100: "#e0f0e4",
                    200: "#b3dbc0",
                    300: "#80c295",
                    400: "#4eaa69",
                    500: "#268844", // Primary dark green shade
                    600: "#206e39",
                    700: "#19542e",
                    800: "#123a22",
                    900: "#0b2116",
                },
            },
        },
    },
    plugins: [flowbite.plugin()],
};
