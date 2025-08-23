import { 
  useFetchStockReportQuery,
  useLazyFetchStockReportQuery,
  useExportStockReportMutation
} from '../store/stockReportApi';
import { useAppSelector } from '../../../store/store';
import { 
  FetchStockReportPayload,
  ExportStockReportPayload
} from '../types';

const useStockReport = (filters?: any) => {
  // Fetch stock report
  const { isLoading: isFetching, error: fetchError, refetch } = useFetchStockReportQuery(
    { filters },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  // Lazy fetch for manual refetch
  const [
    handleLazyFetch,
    {
      isLoading: isLazyFetching,
      error: lazyFetchError,
    },
  ] = useLazyFetchStockReportQuery();

  // Select stock report state
  const {
    items,
    summary,
    filters: currentFilters,
    meta,
  } = useAppSelector((state) => state.stockReport);

  const fetchWithFilters = ({
    formData,
    onSuccess,
  }: {
    formData: FetchStockReportPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleLazyFetch(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    });
  };

  // Export stock report
  const [
    handleExport,
    {
      isLoading: isExportLoading,
      isError: isExportError,
      error: exportError,
      data: exportData,
    },
  ] = useExportStockReportMutation();

  const exportReport = ({
    formData,
    onSuccess,
  }: {
    formData: ExportStockReportPayload;
    onSuccess?: CallableFunction;
  }) => {
    handleExport(formData).then((response) => {
      if (response.data?.status === 200) {
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        // Trigger download
        if (response.data.data.download_url) {
          window.open(response.data.data.download_url, '_blank');
        }
      }
    });
  };

  return {
    items,
    summary,
    filters: currentFilters,
    meta,
    isFetching: isFetching || isLazyFetching,
    fetchError: fetchError || lazyFetchError,
    refetch,

    fetchWithFilters: {
      submit: fetchWithFilters,
      isLoading: isLazyFetching,
      error: lazyFetchError,
    },
    export: {
      submit: exportReport,
      isLoading: isExportLoading,
      isError: isExportError,
      error: exportError,
      data: exportData,
    },
  };
};

export default useStockReport;