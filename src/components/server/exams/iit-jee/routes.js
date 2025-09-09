"use client";
import API_CLIENT from "../../config";

// fetch educators of IIT JEE
export const fetchIITJEEEducators = async (body) => {
  try {
    const response = await API_CLIENT.post(
      "/api/educator/by-specialization",
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
// fetch educators of IIT JEE
export const fetchIITJEEOnlineCourses = async (body) => {
  try {
    const response = await API_CLIENT.post(
      "/api/course/by-specialization",
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchIITJEEWebinars = async (body) => {
  try {
    const response = await API_CLIENT.post(
      "/api/webinars/by-specialization",
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchIITJEETestSeries = async (body) => {
  try {
    const response = await API_CLIENT.post(
      "/api/test-series/by-specialization",
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchIITJEEBlogs = async (body) => {
  try {
    const response = await API_CLIENT.post(
      "/api/blogs/by-specialization",
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchOneToOneCourses = async (body) => {
  try {
    const response = await API_CLIENT.get("/api/course/available-oto");
    return response.data;
  } catch (error) {
    throw error;
  }
};
