import {
    FetchThemePayloadType,
    themeApi,
    useFetchThemesQuery,
} from '@seller/store/reducers/themeApi';
import { useAppSelector } from '@seller/store/store';

const useTheme = () => {
	// fetch themes
	useFetchThemesQuery();
	// get themes
	const { selectedTheme, themes } = useAppSelector((state) => state.theme);

	// fetch theme by slug or id
	const [
		handleFetchThemeBySlugOrID,
		{
			isLoading: isFetchThemeBySlugOrIDLoading,
			isError: isFetchThemeBySlugOrIDError,
			error: fetchThemeBySlugOrIDError,
			data: fetchThemeBySlugOrIDData,
		},
	] = themeApi.endpoints.fetchTheme.useLazyQuery();
	const fetchThemeBySlugOrId = ({
		formData,
		onSuccess,
	}: {
		formData: FetchThemePayloadType;
		onSuccess?: CallableFunction;
	}) => {
		handleFetchThemeBySlugOrID(formData).then((response) => {
			if (response.data?.status === 200) {
				if (onSuccess) {
					onSuccess(response.data.data);
				}
			}
		});
	};

	return {
		theme: selectedTheme,
		themes,
		fetchThemeBySlugOrId: {
			submit: fetchThemeBySlugOrId,
			isLoading: isFetchThemeBySlugOrIDLoading,
			isError: isFetchThemeBySlugOrIDError,
			error: fetchThemeBySlugOrIDError,
			data: fetchThemeBySlugOrIDData,
		},
	};
};
export default useTheme;
