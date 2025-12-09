// src/api/axiosInstance.js
import axios from "axios";

/**
 * Axios instance:
 * - Uses baseURL
 * - Sends cookies (refresh token)
 * - Adds Authorization header from memory
 * - Handles refresh with queue
 * - Retries network/5xx errors with backoff
 */

export const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

const instance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ----------------- Access token memory store -----------------
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

export function clearAccessToken() {
  accessToken = null;
}

// ----------------- Request Interceptor -----------------
instance.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // Log final URL (useful for debugging)
  const finalUrl = (config.baseURL || "") + config.url;
  console.log("[axios] Request →", finalUrl, config.method);

  return config;
});

// ----------------- Refresh Queue Logic -----------------
let isRefreshing = false;
let refreshPromise = null;
let failedQueue = [];

function processQueue(err, token) {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (err) return reject(err);
    config.headers.Authorization = `Bearer ${token}`;
    resolve(instance(config));
  });
  failedQueue = [];
}

// ----------------- Backoff Helpers -----------------
const MAX_RETRIES = 3;
const BACKOFF_BASE = 300;
const MULTIPLIER = 2;

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

function backoff(attempt) {
  return BACKOFF_BASE * Math.pow(MULTIPLIER, attempt - 1);
}

// ----------------- Response Interceptor -----------------
instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};

    // 1) Network or 5xx → retry
    const shouldRetry =
      (!error.response || (error.response.status >= 500 && error.response.status <= 599))
      && (original._retryCount || 0) < MAX_RETRIES;

    if (shouldRetry) {
      original._retryCount = (original._retryCount || 0) + 1;
      await sleep(backoff(original._retryCount));
      return instance(original);
    }

    // 2) 401 → refresh
    if (error.response?.status === 401 && !original._retryRefresh) {
      original._retryRefresh = true;

      if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = (async () => {
          try {
            const url = `${API_BASE}/auth/refresh`;
            const res = await axios.post(url, null, { withCredentials: true });

            const newToken = res.data?.accessToken;
            if (!newToken) throw new Error("No access token returned");

            setAccessToken(newToken);
            processQueue(null, newToken);
            return newToken;
          } catch (err) {
            processQueue(err, null);
            throw err;
          } finally {
            isRefreshing = false;
            refreshPromise = null;
          }
        })();
      }

      return refreshPromise.then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return instance(original);
      });
    }

    return Promise.reject(error);
  }
);

export default instance;
