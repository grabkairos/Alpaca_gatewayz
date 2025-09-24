/**
 * Production Configuration
 * Centralized configuration management
 */

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.gatewayz.ai',
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Application Configuration
  app: {
    name: 'Gatewayz',
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
  },

  // Feature Flags
  features: {
    enableApiIntegration: true,
    enableRealTimeUpdates: true,
    enableErrorReporting: process.env.NODE_ENV === 'production',
    enableAnalytics: process.env.NODE_ENV === 'production',
  },

  // UI Configuration
  ui: {
    defaultTheme: 'light',
    enableDarkMode: true,
    enableAnimations: true,
    enableTransitions: true,
  },

  // Security Configuration
  security: {
    enableApiKeyValidation: true,
    enableRateLimiting: true,
    enableCors: true,
    maxApiKeyLength: 100,
    minApiKeyLength: 10,
  },

  // Performance Configuration
  performance: {
    enableCaching: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    enableLazyLoading: true,
    enableImageOptimization: true,
  },

  // Error Handling Configuration
  errorHandling: {
    enableErrorBoundary: true,
    enableErrorReporting: process.env.NODE_ENV === 'production',
    maxRetries: 3,
    retryDelay: 1000,
  },

  // Monitoring Configuration
  monitoring: {
    enableHealthChecks: true,
    enablePerformanceMonitoring: process.env.NODE_ENV === 'production',
    enableUserAnalytics: process.env.NODE_ENV === 'production',
  },
} as const;

// Type-safe configuration access
export type Config = typeof config;

// Helper functions
export const isFeatureEnabled = (feature: keyof typeof config.features): boolean => {
  return config.features[feature];
};

export const isDevelopment = (): boolean => {
  return config.app.isDevelopment;
};

export const isProduction = (): boolean => {
  return config.app.isProduction;
};

export const getApiUrl = (): string => {
  return config.api.baseUrl;
};
