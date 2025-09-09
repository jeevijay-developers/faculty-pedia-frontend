"use client";
import axios from "axios";

const API_CLIENT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  withCredentials: true,
});

API_CLIENT.interceptors.request.use(
  (config) => {
    console.log("Request made to: ", config.url);

    if (typeof window !== "undefined") {
      // Check if in browser
      const TOKEN = localStorage.getItem("faculty-pedia-auth-token");
      if (TOKEN) {
        config.headers.Authorization = `Bearer ${TOKEN}`;
      } else {
        window.location.href = "/student-login";
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API_CLIENT.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(typeof window !== "undefined");
    console.log(error.response?.status);

    if (typeof window !== "undefined" && error.response?.status === 401) {
      window.location.href = "/student-login";
    }
    return Promise.reject(error);
  }
);

export default API_CLIENT;
