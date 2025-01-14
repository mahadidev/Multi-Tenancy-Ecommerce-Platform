import Component from "./simfy-commerce/components";

const Themes = {
    "simfy-commerce": {
        id: "1",
        slug: "simfy-commerce",
        name: "Simfy Commerce",
        component: (data: any) => <Component data={data} />,
    },
};

const ThemeById = (id: string) => {
    const obj: any = Object.keys(Themes);

    const theme = obj.map((key: "simfy-commerce") => {
        if (Themes[key].id == id) {
            return Themes[key];
        }
    })[0];

    return theme;
};

export { ThemeById, Themes };
