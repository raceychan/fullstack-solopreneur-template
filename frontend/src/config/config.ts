// frontend/src/config/config.ts

import { client } from '@/client/client.gen'

const ENV = import.meta.env;

const API_HOST = ENV.VITE_BACKEND_API_HOST ?? "localhost";
const API_PORT = ENV.VITE_BACKEND_API_PORT ?? "8000";
const API_VERSION = ENV.VITE_BACKEND_API_VERSION ?? "1";

const API_NETLOC = `${API_HOST}:${API_PORT}`;
const API_BASE_URL = `http://${API_NETLOC}/api/v${API_VERSION}`;

export const config = {
  API_HOST,
  API_PORT,
  API_VERSION,
  API_NETLOC,
  API_BASE_URL,
  REQUEST: {
    TIMEOUT_MS: 1000,
  },
} as const;



export const logApiResponse = (response: any) => {
  console.error(
    `API Error: ${response.config.method} ${response.config.url} - Status: ${response.status}, Data: ${JSON.stringify(response.data)}, Request: ${JSON.stringify(response.config.data)}
    Response: ${JSON.stringify(response)}`
  );
};

// Use expires_at from localStorage, set after login
const isTokenExpired = () => {
  const expiresAt = localStorage.getItem("expires_at");
  if (!expiresAt) return true;
  return Date.now() >= Number(expiresAt);
};

export const initializeClient = () => {
  client.setConfig({
    baseURL: config.API_BASE_URL,
    timeout: config.REQUEST.TIMEOUT_MS,
  });

  client.instance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("access_token") || "";
    if (accessToken) {
      if (isTokenExpired()) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_at");
        window.location.href = "/login";
        return Promise.reject("Token expired. Redirecting to login.");
      }
      config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return config;
  });

  client.instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if ([401, 404].includes(error.response.status)) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("expires_at");
          window.location.href = "/login";
        }
        logApiResponse(error.response);
      }
      return Promise.reject(error);
    }
  );
};


export const init_app = async () => {
  initializeClient();
  const response = await client.get({
    url: "/health",
  });
  console.log("response", response);
}
