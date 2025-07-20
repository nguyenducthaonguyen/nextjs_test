/**
 * API utility for handling HTTP requests with common response and error handling
 */

// Base response type for all API responses
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
};

// Error types for different scenarios
export class ApiError extends Error {
  status: number;
  response?: Response;
  data?: any;

  constructor(message: string, status: number, response?: Response, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
    this.data = data;
  }
}

// Request configuration interface
export type RequestConfig = {
  timeout?: number;
  baseURL?: string;
  params?: Record<string, any>;
} & RequestInit;

// Default configuration
const DEFAULT_CONFIG: RequestConfig = {
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

// Base URL configuration - can be overridden via environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Creates a timeout promise that rejects after the specified time
 */
function createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeout);
  });
}

/**
 * Converts an object to URL search parameters
 */
function objectToParams(obj: Record<string, any>): string {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, String(value));
    }
  });
  return params.toString();
}

/**
 * Main HTTP client class
 */
export class HttpClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string = BASE_URL, defaultHeaders: HeadersInit = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  /**
   * Makes an HTTP request with common error handling
   */
  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const {
      timeout = DEFAULT_CONFIG.timeout,
      baseURL = this.baseURL,
      params,
      headers = {},
      ...fetchConfig
    } = config;

    // Build URL with parameters
    let url = new URL(endpoint, baseURL).href;
    if (params) {
      const paramString = objectToParams(params);
      url += `?${paramString}`;
    }

    // Merge headers
    const mergedHeaders = {
      ...DEFAULT_CONFIG.headers,
      ...this.defaultHeaders,
      ...headers,
    };

    // Create fetch promise
    const fetchPromise = fetch(url, {
      ...fetchConfig,
      headers: mergedHeaders,
    });

    // Create timeout promise
    const timeoutPromise = createTimeoutPromise(timeout!);

    try {
      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // Handle non-Response (timeout case)
      if (!(response instanceof Response)) {
        throw new ApiError('Request timeout', 408);
      }

      // Parse response
      let data: any;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      // Handle HTTP errors
      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}`;
        throw new ApiError(errorMessage, response.status, response, data);
      }

      // Return successful response
      return {
        success: true,
        data,
        message: data?.message,
      };
    } catch (error) {
      // Handle network errors and API errors
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network/fetch errors
      if (error instanceof TypeError) {
        throw new ApiError('Network error', 0, undefined, error);
      }

      // Handle other errors
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        0,
        undefined,
        error,
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * Set default headers
   */
  setDefaultHeaders(headers: HeadersInit) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Set authorization token
   */
  setAuthToken(tokenType: string, token: string) {
    this.setDefaultHeaders({ Authorization: `${tokenType} ${token}` });
  }

  /**
   * Remove authorization token
   */
  removeAuthToken() {
    const headers = { ...this.defaultHeaders };
    delete (headers as any).Authorization;
    this.defaultHeaders = headers;
  }
}
