import axios from "axios";
import LocalStorageService from "./localStorageService";
import { notification } from "antd";
import { localPathMappings, API_BASE_URL } from "../configs/env.config";

// Set default axios base URL dynamically
axios.interceptors.request.use(
  (config: any) => {
    const token = LocalStorageService.getAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const pathSegments = config.url.split("/").filter(Boolean);
    const currentIsLocalhost = window.location.hostname === "localhost";

    const baseUrl = currentIsLocalhost
      ? localPathMappings[pathSegments[0]] || localPathMappings.login
      : API_BASE_URL;

    config.baseURL = `${baseUrl}/api/v1/`;

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;
    const statusCode = response?.status || 0;
    const currentIsLocalhost = window.location.hostname === "localhost";

    // Centralized error handling
    if (!navigator.onLine && !currentIsLocalhost) {
      handleOfflineError();
    } else {
      await handleErrorResponse(error, statusCode);
    }

    return Promise.reject(error);
  }
);

/** Centralized Error Response Handling */
async function handleErrorResponse(error: any, statusCode: number) {
  switch (statusCode) {
    case 401:
      handleUnauthorizedError(error);
      break;
    case 422:
      handleValidationErrors(error);
      break;
    case 406:
      handleSpecificError(
        error,
        "Error 406 Occurred",
        "A specific issue occurred. Please contact support."
      );
      break;
    case 429:
      await handleTooManyRequestsError(error);
      break;
    case 500:
      handleServerError(error);
      break;
    default:
      handleGenericError(error);
      break;
  }
}

/** Handle Unauthorized Errors (401) */
function handleUnauthorizedError(error: any) {
  notification.error({
    message: "Unauthorized Access",
    description: error?.response?.data?.message || "Your session has expired. Please log in again.",
    duration: 5,
  });

  LocalStorageService.clearToken();
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

const getErrorMessage = (error: any): string => {
  try {
    if (error?.response?.data?.data) {
      const errorData = error.response.data.data;
      const firstErrorObj = Object.values(errorData)[0];

      if (firstErrorObj && typeof firstErrorObj === 'object') {
        const firstErrorMessage = Object.values(firstErrorObj)[0];
        if (firstErrorMessage) {
          return String(firstErrorMessage);
        }
      }

      if (typeof firstErrorObj === 'string') {
        return firstErrorObj;
      }
    }

    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    return error?.message || 'An unexpected error occurred';
  } catch (e) {
    console.error("Error getting error message:", e);
    return 'An unexpected error occurred';
  }
};

/** Handle Validation Errors (422) */
function handleValidationErrors(error: any) {
  const validationMessage = getErrorMessage(error) || "Validation error occurred.";

  notification.error({
    message: "Validation Error",
    description: `${error.message}: ${validationMessage}`,
    duration: 5,
  });
}

/** Handle Too Many Requests (429) with Retry Logic */
async function handleTooManyRequestsError(error: any) {
  notification.warning({
    message: "Rate Limit Exceeded",
    description: "You are sending too many requests. Please wait a moment before retrying.",
    duration: 5,
  });

  await retryRequest(error.config, 2);
}

/** Retry Request with Exponential Backoff */
async function retryRequest(config: any, retries: number) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Retrying request (${i + 1}/${retries})...`);
      await delay(1000 * 2 ** i);
      return await axios.request(config);
    } catch (retryError) {
      console.error("Error retrying request:", retryError);
      if (i === retries - 1) throw retryError;
    }
  }
}

/** Handle Specific Errors */
function handleSpecificError(error: any, title: string, defaultDescription: string) {
  const { data } = error.response || {};
  notification.error({
    message: title,
    description: data?.message || defaultDescription,
    duration: 5,
  });
}

/** Handle Server Errors (500) */
function handleServerError(error: any) {
  notification.error({
    message: "Server Error",
    description: error?.response?.data?.message || "An unexpected error occurred. Please try again later.",
    duration: 5,
  });

  console.error("Server Error:", error?.response?.data?.message || error);
}

/** Handle Offline Errors */
function handleOfflineError() {
  notification.error({
    message: "No Internet Connection",
    description: "You are offline. Please check your network connection.",
    duration: 5,
  });
}

/** Handle Generic Errors */
function handleGenericError(error: any) {
  const errorMessage =
    error.message +
    (error?.response?.data?.message ? `: ${error.response.data.message}` : "");

  notification.error({
    message: "Error",
    description: errorMessage,
    duration: 5,
  });
}

/** Delay Utility */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default axios;
