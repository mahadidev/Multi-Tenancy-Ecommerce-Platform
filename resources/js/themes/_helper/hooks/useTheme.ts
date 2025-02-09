import { useFetchThemeQuery } from '@themes/_helper/store/reducers/themeApi';
import { useAppSelector } from '@themes/_helper/store/store';
import { THEME_SLUG } from '@themes/_helper/theme_env';

const useTheme = () => {
	// fetch theme
	const { isLoading: isFetchThemeLoading } = useFetchThemeQuery({
		idOrSlug: THEME_SLUG,
	});

	// get theme
	const { theme } = useAppSelector((state) => state.theme);

	return {
		fetchTheme: {
			isLoading: isFetchThemeLoading,
		},
		theme,
	};
};
export default useTheme;
