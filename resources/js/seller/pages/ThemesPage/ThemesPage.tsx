import useTheme from "@seller/hooks/useTheme";
import { FC } from "react";
import ThemeCard from "./ThemeCard";

const ThemesPage: FC = function () {
    const { themes } = useTheme();

    return (
        <div className="p-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {themes.map((theme) => (
                <ThemeCard theme={theme} />
            ))}
        </div>
    );
};
export default ThemesPage;
