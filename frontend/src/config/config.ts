// frontend/src/config/config.ts

import { client } from '@/client/client.gen'
import { getAccessToken, removeAccessToken } from "@/utils/auth-utils"

const ENV = import.meta.env;

const PROJECT_NAME = ENV.VITE_PROJECT_NAME ?? "Lihil-solopreneur"
const PROJECT_DESCRIPTION = ENV.VITE_PROJECT_DESCRIPTION?? "Full stack solopreneur template"
const API_HOST = ENV.VITE_BACKEND_API_HOST ?? "localhost";
const API_PORT = ENV.VITE_BACKEND_API_PORT ?? "8000";
const API_VERSION = ENV.VITE_BACKEND_API_VERSION ?? "1";
const API_NETLOC = `${API_HOST}:${API_PORT}`;
const API_BASE_URL = `http://${API_NETLOC}`;

const REQUEST_TIMEOUT_MS = Number(ENV.VITE_REQUEST_TIMEOUT_MS ?? "3000");


export const config = {
  PROJECT_NAME,
  PROJECT_DESCRIPTION,
  API_HOST,
  API_PORT,
  API_VERSION,
  API_NETLOC,
  API_BASE_URL,
  REQUEST: {
    TIMEOUT_MS: REQUEST_TIMEOUT_MS,
  },
} as const;


export const logApiResponse = (response: any) => {
  const { method, url, data: requestData } = response.config || {};
  const { status, data: responseData } = response;

  console.error(
    [
      "🚨 API Error",
      `Method:   ${method?.toUpperCase()}`,
      `URL:      ${url}`,
      `Status:   ${status}`,
      `Request:  ${JSON.stringify(requestData, null, 2)}`,
      `Response: ${JSON.stringify(responseData, null, 2)}`,
    ].join("\n")
  );
};

export const initializeClient = () => {
  client.setConfig({
    baseURL: config.API_BASE_URL,
    timeout: config.REQUEST.TIMEOUT_MS,
  });

  client.instance.interceptors.request.use((config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
        config.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    else{
      config.headers.delete('Authorization');
    }
    return config;
  });

  client.instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        if ([401, 404].includes(error.response.status)) {
          removeAccessToken()
          window.location.href = "/sign-in";
        }
        logApiResponse(error.response);
      }
      return Promise.reject(error);
    }
  );
};


export const init_app = async () => {
  initializeClient();
}
