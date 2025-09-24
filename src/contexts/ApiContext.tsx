/**
 * API Context for managing authentication and global API state
 * Maintains UI/UX while adding production backend integration
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient, ApiError, isAuthError } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface ApiContextType {
  apiKey: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setApiKey: (key: string | null) => void;
  clearAuth: () => void;
  userBalance: any;
  userProfile: any;
  refreshUserData: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userBalance, setUserBalance] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const { toast } = useToast();

  // Load API key from localStorage on mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem('gatewayz_api_key');
    if (storedApiKey) {
      setApiKeyState(storedApiKey);
      apiClient.setApiKey(storedApiKey);
    }
    setIsLoading(false);
  }, []);

  // Set API key and store in localStorage
  const setApiKey = (key: string | null) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem('gatewayz_api_key', key);
      apiClient.setApiKey(key);
    } else {
      localStorage.removeItem('gatewayz_api_key');
      apiClient.setApiKey('');
    }
  };

  // Clear authentication
  const clearAuth = () => {
    setApiKey(null);
    setUserBalance(null);
    setUserProfile(null);
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (!apiKey) return;

    try {
      const [balanceResponse, profileResponse] = await Promise.all([
        apiClient.getUserBalance(),
        apiClient.getUserProfile(),
      ]);

      setUserBalance(balanceResponse.data);
      setUserProfile(profileResponse.data);
    } catch (error) {
      if (isAuthError(error)) {
        clearAuth();
        toast({
          title: 'Authentication expired',
          description: 'Please sign in again',
          variant: 'destructive',
        });
      }
    }
  };

  // Load user data when API key is set
  useEffect(() => {
    if (apiKey) {
      refreshUserData();
    }
  }, [apiKey]);

  const value: ApiContextType = {
    apiKey,
    isAuthenticated: !!apiKey,
    isLoading,
    setApiKey,
    clearAuth,
    userBalance,
    userProfile,
    refreshUserData,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiContext() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}
