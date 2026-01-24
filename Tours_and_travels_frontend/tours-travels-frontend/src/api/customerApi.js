import axiosInstance from "./axiosInstance";

/* ================= PACKAGES ================= */

export const getApprovedPackagesApi = () => {
  return axiosInstance.get("/customer/packages");
};

/* ================= BOOKINGS ================= */

export const createBookingApi = (bookingData) => {
  return axiosInstance.post("/customer/bookings", bookingData);
};

export const getCustomerBookingsApi = () => {
  return axiosInstance.get("/customer/bookings");
};

export const cancelBookingApi = (bookingId) => {
  return axiosInstance.put(`/customer/bookings/${bookingId}/cancel`);
};

// Get customer payments
export const getMyPaymentsApi = () => {
  return axiosInstance.get("/customer/payments");
};