/**
 * Custom hooks for API integration
 * Maintains UI/UX while connecting to production backend
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, ApiError, handleApiError } from '@/lib/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T>(
  apiCall: () => Promise<{ data?: T }>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data || null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

export function useModels() {
  return useApi(() => apiClient.getModels());
}

export function useModelProviders() {
  return useApi(() => apiClient.getModelProviders());
}

export function useUserBalance() {
  return useApi(() => apiClient.getUserBalance());
}

export function useUserProfile() {
  return useApi(() => apiClient.getUserProfile());
}

export function useUserMonitor() {
  return useApi(() => apiClient.getUserMonitor());
}

export function useApiKeys() {
  return useApi(() => apiClient.getApiKeys());
}

export function useApiKeyUsage() {
  return useApi(() => apiClient.getApiKeyUsage());
}

// Mutation hooks for write operations
export function useApiMutation<T, P = any>(
  mutationFn: (params: P) => Promise<{ data?: T }>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const response = await mutationFn(params);
      return response.data || null;
    } catch (err) {
      setError(handleApiError(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  return {
    mutate,
    loading,
    error,
  };
}

export function useChatCompletion() {
  return useApiMutation((chatData: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    temperature?: number;
    max_tokens?: number;
  }) => apiClient.chatCompletion(chatData));
}

export function useCreateApiKey() {
  return useApiMutation((keyData: any) => apiClient.createApiKey(keyData));
}

export function useDeleteApiKey() {
  return useApiMutation((keyId: string) => apiClient.deleteApiKey(keyId));
}

export function useUpdateUserProfile() {
  return useApiMutation((profileData: any) => apiClient.updateUserProfile(profileData));
}
