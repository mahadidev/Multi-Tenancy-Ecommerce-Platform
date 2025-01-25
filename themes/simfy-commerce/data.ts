import heroWidget from "./components/hero.json";
import offerWidget from "./components/offers.json";

export const themeJson = {
    name: "Simfy Commerce",
    slug: "simfy-commerce",
    thumbnail: "https://placehold.co/600x400",
    pages: [
        {
            name: "home",
            label: "home",
            slug: "/",
            title: "Home page",
            type: 1,
            thumbnail: "https://placehold.co/600x400",
            widgets: [heroWidget, offerWidget],
        },
    ],
};
