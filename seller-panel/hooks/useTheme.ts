import { useFetchThemesQuery } from "@seller-panel/store/reducers/themeApi";
import { useAppSelector } from "@seller-panel/store/store";

const useTheme = () => {
    // fetch themes
    useFetchThemesQuery();
    // get themes
    const {theme, themes} = useAppSelector((state) => state.theme)

    return {theme, themes}
}
export default useTheme
