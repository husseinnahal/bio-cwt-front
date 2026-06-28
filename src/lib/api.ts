import { store } from '@/store';
import { clearAuth, setAccessToken } from '@/store/authSlice';
import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create a configured Axios instance
const api = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Helper to queue requests while refreshing token
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Helper to flush queued requests when token is refreshed
const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Request Interceptor: Automatically inject Authorization token from Redux store
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Automatically handle token refresh rotation on 401
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Intercept 401 Unauthorized errors and attempt to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = Cookies.get('refresh_token');

      // If no refresh token is present in the cookies, force log out
      if (!refreshToken) {
        store.dispatch(clearAuth());
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Direct axios call to bypass interceptor logic
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          if (response.status === 200 || response.status === 201) {
            const { access_token, refresh_token } = response.data;

            // Update Redux state and Cookie
            store.dispatch(setAccessToken(access_token));
            Cookies.set('refresh_token', refresh_token, {
              secure: true,
              sameSite: 'strict',
              expires: 15, // Expires in 15 days (matching JWT refresh token duration)
            });

            isRefreshing = false;
            onRefreshed(access_token);

            // Directly retry the original request that triggered the refresh
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
            }
            return api(originalRequest);
          } else {
            throw new Error('Token refresh failed');
          }
        } catch (refreshError) {
          isRefreshing = false;
          // Clear credentials on failed refresh and redirect
          Cookies.remove('refresh_token');
          store.dispatch(clearAuth());
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        }
      }

      // If refresh is already in progress, queue this request
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }
          resolve(api(originalRequest));
        });
      });
    }

    // Standardize error formats
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

class ApiClient {
  // Returns access token from Redux store
  static getAccessToken(): string | null {
    return store.getState().auth.accessToken;
  }

  // Returns refresh token from Cookies
  static getRefreshToken(): string | null {
    return Cookies.get('refresh_token') || null;
  }

  // Save tokens to Redux (access token) and Cookies (refresh token)
  static setTokens(accessToken: string, refreshToken: string) {
    store.dispatch(setAccessToken(accessToken));
    Cookies.set('refresh_token', refreshToken, {
      secure: true,
      sameSite: 'strict',
      expires: 15,
    });
  }

  // Clear all authorization credentials
  static clearTokens() {
    store.dispatch(clearAuth());
    Cookies.remove('refresh_token');
  }

  // Helper for GET requests
  static async get(endpoint: string, options?: AxiosRequestConfig): Promise<unknown> {
    return api.get(endpoint, options) as unknown;
  }

  // Helper for POST requests
  static async post(endpoint: string, body: unknown, options?: AxiosRequestConfig): Promise<unknown> {
    return api.post(endpoint, body, options) as unknown;
  }

  // Helper for PUT requests
  static async put(endpoint: string, body: unknown, options?: AxiosRequestConfig): Promise<unknown> {
    return api.put(endpoint, body, options) as unknown;
  }

  // Helper for DELETE requests
  static async delete(endpoint: string, options?: AxiosRequestConfig): Promise<unknown> {
    return api.delete(endpoint, options) as unknown;
  }

  // Backwards compatibility custom request wrapper
  static async request(endpoint: string, options: AxiosRequestConfig & { body?: unknown } = {}): Promise<any> {
    const { body, ...config } = options;
    return api({
      url: endpoint,
      data: body,
      ...config,
    });
  }
}

export default ApiClient;
