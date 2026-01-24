import axios from "./axiosInstance";
// tourApi.js
export const getTours = () => {};

export const createTour = (data) =>
  axios.post("/tours", data);

export const updateTour = (id, data) =>
  axios.put(`/tours/${id}`, data);

export const getTourById = (id) =>
  axios.get(`/tours/${id}`);

