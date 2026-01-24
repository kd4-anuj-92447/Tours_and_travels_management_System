import axiosInstance from "./axiosInstance";

/**
 * =========================
 * CUSTOMER BOOKINGS
 * =========================
 */

/**
 * Create a booking for a package
 * POST /api/bookings
 */
export const createBookingApi = (packageId) => {
  return axiosInstance.post("/bookings", {
    packageId
  });
};

/**
 * Get logged-in customer's bookings
 * GET /api/bookings/my
 */
export const getMyBookingsApi = () => {
  return axiosInstance.get("/bookings/my");
};

/**
 * Cancel a booking
 * PUT /api/bookings/{bookingId}/cancel
 */
export const cancelBookingApi = (bookingId) => {
  return axiosInstance.put(`/bookings/${bookingId}/cancel`);
};
