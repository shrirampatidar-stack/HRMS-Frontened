import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://hrms-backened.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error(`API Error: ${error.response.status} ${error.config?.url}`, error.response.data);
      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response
      console.error("API Error: No response from server", error.request);
      error.response = {
        data: {
          message: "Unable to connect to server. Please check if the backend is running.",
        },
      };
      return Promise.reject(error);
    } else {
      // Error setting up request
      console.error("API Error: Request setup failed", error.message);
      error.response = {
        data: {
          message: "An unexpected error occurred. Please try again.",
        },
      };
      return Promise.reject(error);
    }
  }
);
