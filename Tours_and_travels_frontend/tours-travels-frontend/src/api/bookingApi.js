import axios from "./axiosInstance";

/* =========================
   CUSTOMER BOOKINGS
========================= */

export const createBookingApi = (packageId) => {
  return axios.post(`/customer/bookings`, { tourPackage: { id: packageId } });
};

export const getMyBookingsApi = () => {
  return axios.get(`/customer/bookings`);
};

export const cancelBookingByCustomerApi = (bookingId) => {
  return axios.put(`/customer/bookings/${bookingId}/cancel`, {});
};

/* =========================
   PAYMENT
========================= */

export const createPaymentApi = (bookingId) => {
  return axios.post(`/customer/payments`, { booking: { id: bookingId } });
};

export const getMyPaymentsApi = () => {
  return axios.get(`/customer/payments`);
};

/* =========================
   ADMIN BOOKINGS
========================= */

export const getAllBookingsAdminApi = () => {
  return axios.get(`/admin/bookings`);
};

export const getPendingBookingsAdminApi = () => {
  return axios.get(`/admin/bookings/pending`);
};

export const confirmBookingAdminApi = (bookingId) => {
  return axios.put(`/admin/bookings/${bookingId}/confirm`, {});
};

export const cancelBookingAdminApi = (bookingId) => {
  return axios.put(`/admin/bookings/${bookingId}/cancel`, {});
};

/* =========================
   AGENT BOOKINGS
========================= */

export const getBookingsForAgentApi = () => {
  return axios.get(`/agent/bookings`);
};

export const approveBookingAgentApi = (bookingId) => {
  return axios.put(`/agent/bookings/${bookingId}/approve`, {});
};

export const rejectBookingAgentApi = (bookingId) => {
  return axios.put(`/agent/bookings/${bookingId}/reject`, {});
};
