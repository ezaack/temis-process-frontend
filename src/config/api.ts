import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Configuration
interface ApiConfig {
  baseURL: string;
  version: string;
  timeout: number;
}

// Get configuration from environment variables
const config: ApiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://termis-process-service-6klewh6jvq-lz.a.run.app',
  version: import.meta.env.VITE_API_VERSION || 'v0',
  timeout: 30000, // 30 seconds
};

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: `${config.baseURL}/${config.version}`,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get the current auth token
// This will be set by the auth service
let getAuthToken: (() => string | null) | null = null;

export const setAuthTokenGetter = (getter: () => string | null) => {
  getAuthToken = getter;
};

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Try to get token from localStorage first
    const userStr = localStorage.getItem('loggedInUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.accessToken) {
          config.headers.Authorization = user.accessToken;
          return config;
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }

    // Fallback: Use the token getter function if provided
    if (getAuthToken) {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = token;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common error scenarios
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - token expired or invalid
          console.error('Unauthorized access - token may be expired');
          // Could redirect to login here if needed
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error occurred');
          break;
        default:
          console.error('API Error:', error.response.status);
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('No response from server');
    } else {
      // Error setting up request
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Export configured axios instance
export default apiClient;

// Export config for direct access if needed
export { config };
