import { 
  useFetchThemesQuery,
  useLazyFetchThemeQuery,
  useActivateThemeMutation,
  useInstallThemeMutation
} from '../store/themeApi';
import { useAppSelector } from '../../../store/store';
import { 
  FetchThemePayload,
  ActivateThemePayload,
  InstallThemePayload
} from '../types';

const useTheme = () => {
  // Fetch themes
  useFetchThemesQuery();

  // Select theme state
  const {
    themes,
    selectedTheme,
    activeTheme,
    meta,
  } = useAppSelector((state) => state.theme);

  // Lazy fetch theme by slug or id
  const [
    handleFetchThemeBySlugOrID,
    {
      isLoading: isFetchThemeBySlugOrIDLoading,
      isError: isFetchThemeBySlugOrIDError,
      error: fetchThemeBySlugOrIDError,
      data: fetchThemeBySlugOrIDData,
    },
  ] = useLazyFetchThemeQuery();

  const fetchThemeBySlugOrId = ({
    formData,
    onSuccess,
  }: {
    formData: FetchThemePayload;
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

  // Activate theme
  const [
    handleActivate,
    {
      isLoading: isActivateLoading,
      isError: isActivateError,
      error: activateError,
      data: activateData,
    },
  ] = useActivateThemeMutation();

  const activateTheme = ({
    formData,
    onSuccess,
  }: {
    formData: ActivateThemePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleActivate(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Install theme
  const [
    handleInstall,
    {
      isLoading: isInstallLoading,
      isError: isInstallError,
      error: installError,
      data: installData,
    },
  ] = useInstallThemeMutation();

  const installTheme = ({
    formData,
    onSuccess,
  }: {
    formData: InstallThemePayload;
    onSuccess?: CallableFunction;
  }) => {
    handleInstall(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  return {
    themes,
    selectedTheme,
    activeTheme,
    meta,

    fetchThemeBySlugOrId: {
      submit: fetchThemeBySlugOrId,
      isLoading: isFetchThemeBySlugOrIDLoading,
      isError: isFetchThemeBySlugOrIDError,
      error: fetchThemeBySlugOrIDError,
      data: fetchThemeBySlugOrIDData,
    },
    activate: {
      submit: activateTheme,
      isLoading: isActivateLoading,
      isError: isActivateError,
      error: activateError,
      data: activateData,
    },
    install: {
      submit: installTheme,
      isLoading: isInstallLoading,
      isError: isInstallError,
      error: installError,
      data: installData,
    },
  };
};

export default useTheme;