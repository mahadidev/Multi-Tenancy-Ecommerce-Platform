import { useAppSelector } from "@/seller/store";
import { useFetchThemeQuery } from "@/seller/store/reducers/themeApi";

const useTheme = () => {
    const { store, theme } = useAppSelector((state) => state);
    // fetch theme
    useFetchThemeQuery(store.currentStore.theme_id);

    return {
        theme: theme.theme,
        themes: theme.themes,
    };
};

export default useTheme;
