import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error
      return Promise.reject(error);
    } else if (error.request) {
      // Request made but no response
      error.response = {
        data: {
          message: "Unable to connect to server. Please check if the backend is running.",
        },
      };
      return Promise.reject(error);
    } else {
      // Error setting up request
      error.response = {
        data: {
          message: "An unexpected error occurred. Please try again.",
        },
      };
      return Promise.reject(error);
    }
  }
);
