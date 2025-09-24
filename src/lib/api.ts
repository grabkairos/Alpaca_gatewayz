/**
 * Production API client for Gatewayz backend integration
 * Maintains exact UI/UX while connecting to real backend
 */

import { config } from './config';

const API_BASE_URL = config.api.baseUrl;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiClient {
  private baseUrl: string;
  private apiKey: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${this.apiKey}`;
    }

    // Add timeout and retry logic
    return this.requestWithRetry(url, {
      ...options,
      headers,
    });
  }

  private async requestWithRetry<T>(
    url: string,
    options: RequestInit,
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.api.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}`,
          response.status,
          errorData.code
        );
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      // Retry logic for network errors
      if (attempt < config.api.retryAttempts && this.shouldRetry(error)) {
        await this.delay(config.api.retryDelay * attempt);
        return this.requestWithRetry(url, options, attempt + 1);
      }

      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  private shouldRetry(error: unknown): boolean {
    if (error instanceof ApiError) {
      // Retry on server errors (5xx) and rate limiting (429)
      return error.status >= 500 || error.status === 429;
    }
    // Retry on network errors
    return true;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }

  // Models endpoints
  async getModels() {
    return this.request('/models');
  }

  async getModelProviders() {
    return this.request('/models/providers');
  }

  // User endpoints
  async getUserBalance() {
    return this.request('/user/balance');
  }

  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserMonitor() {
    return this.request('/user/monitor');
  }

  async getUserLimits() {
    return this.request('/user/limit');
  }

  // API Keys management
  async createApiKey(keyData: any) {
    return this.request('/user/api-keys', {
      method: 'POST',
      body: JSON.stringify(keyData),
    });
  }

  async getApiKeys() {
    return this.request('/user/api-keys');
  }

  async deleteApiKey(keyId: string) {
    return this.request(`/user/api-keys/${keyId}`, {
      method: 'DELETE',
    });
  }

  async getApiKeyUsage() {
    return this.request('/user/api-keys/usage');
  }

  // Chat completion
  async chatCompletion(chatData: {
    model: string;
    messages: Array<{ role: string; content: string }>;
    temperature?: number;
    max_tokens?: number;
  }) {
    return this.request('/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify(chatData),
    });
  }

  // Admin endpoints (if needed)
  async addCredits(userId: string, amount: number) {
    return this.request('/admin/add_credits', {
      method: 'POST',
      body: JSON.stringify({ userId, amount }),
    });
  }

  async getSystemMonitor() {
    return this.request('/admin/monitor');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Utility functions
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof ApiError && error.status === 0;
};

export const isAuthError = (error: unknown): boolean => {
  return error instanceof ApiError && error.status === 401;
};
