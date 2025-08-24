import { isRejectedWithValue, isFulfilled, Middleware, AnyAction } from '@reduxjs/toolkit';
import { setToast, clearToast } from '../slices/notificationSlice';

interface ApiResponse {
  status?: number;
  success?: boolean;
  message?: string;
  description?: string;
  data?: {
    message?: string;
    description?: string;
    error?: string;
  };
  error?: string;
  errors?: Record<string, string[]>;
}

interface ApiAction extends AnyAction {
  payload?: ApiResponse | string;
  meta?: {
    arg?: {
      endpointName?: string;
    };
  };
}

export const apiToastMiddleware: Middleware = (store) => (next) => (action: unknown) => {
  const typedAction = action as ApiAction;
  
  // Helper function to check if this is a mutation (not a query)
  const isMutation = (action: ApiAction) => {
    const endpointName = action.meta?.arg?.endpointName;
    if (!endpointName) return false;
    
    // RTK Query mutations typically end with 'Mutation'
    return endpointName.includes('Mutation') || 
           endpointName.toLowerCase().includes('create') ||
           endpointName.toLowerCase().includes('update') ||
           endpointName.toLowerCase().includes('delete') ||
           endpointName.toLowerCase().includes('remove') ||
           endpointName.toLowerCase().includes('submit');
  };

  // Handle successful API responses
  if (isFulfilled(typedAction)) {
    const payload = typedAction.payload as ApiResponse;
    
    // Only show toasts for mutations, not queries
    if (isMutation(typedAction) && payload && typeof payload === 'object') {
      // Check for standard API response with status 200 and message
      if (payload.status === 200 && payload.message) {
        store.dispatch(setToast({
          text: payload.message,
          status: 'success',
          description: payload.description || undefined,
        }));
        
        // Auto dismiss after 3 seconds
        setTimeout(() => {
          store.dispatch(clearToast());
        }, 3000);
      }
      // Also handle success field in response
      else if (payload.success && payload.message) {
        store.dispatch(setToast({
          text: payload.message,
          status: 'success',
          description: payload.description || undefined,
        }));
        
        setTimeout(() => {
          store.dispatch(clearToast());
        }, 3000);
      }
      // Handle data.message format
      else if (payload.data?.message) {
        store.dispatch(setToast({
          text: payload.data.message,
          status: 'success',
          description: payload.data.description || undefined,
        }));
        
        setTimeout(() => {
          store.dispatch(clearToast());
        }, 3000);
      }
    }
  }

  // Handle failed API responses
  if (isRejectedWithValue(typedAction)) {
    const payload = typedAction.payload;
    
    // Only show error toasts for mutations, not queries
    if (isMutation(typedAction)) {
      let errorMessage = 'An error occurred';
      let errorDescription: string | undefined = undefined;
      
      // Extract error message from various possible formats
      if (typeof payload === 'string') {
        errorMessage = payload;
      } else if (payload && typeof payload === 'object') {
        const apiPayload = payload as ApiResponse;
        
        if (apiPayload.message) {
          errorMessage = apiPayload.message;
          errorDescription = apiPayload.description || apiPayload.error || undefined;
        } else if (apiPayload.data?.message) {
          errorMessage = apiPayload.data.message;
          errorDescription = apiPayload.data.description || apiPayload.data.error || undefined;
        } else if (apiPayload.error) {
          errorMessage = typeof apiPayload.error === 'string' ? apiPayload.error : 'An error occurred';
        }
        
        // Handle validation errors
        if (apiPayload.errors) {
          const firstError = Object.values(apiPayload.errors)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            errorDescription = firstError[0];
          }
        }
      }
      
      store.dispatch(setToast({
        text: errorMessage,
        status: 'danger',
        description: errorDescription,
      }));
      
      // Auto dismiss after 5 seconds for errors
      setTimeout(() => {
        store.dispatch(clearToast());
      }, 5000);
    }
  }

  return next(action);
};