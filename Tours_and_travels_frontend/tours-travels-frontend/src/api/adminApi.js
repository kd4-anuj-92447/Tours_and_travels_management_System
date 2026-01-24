import axiosInstance from "./axiosInstance";

/* ================= USERS ================= */

export const getAllUsersApi = () =>
  axiosInstance.get("/admin/users");

/* ================= PACKAGES ================= */

// Pending packages only
export const getPendingPackagesApi = () =>
  axiosInstance.get("/admin/packages/pending");

// Admin approve / reject package
export const adminPackageDecisionApi = (packageId, decision) =>
  axiosInstance.put(`/admin/packages/${packageId}/decision`, { decision });

/* ================= BOOKINGS ================= */

// All bookings (admin full view)
export const getAllBookingsAdminApi = () =>
  axiosInstance.get("/admin/bookings");

// Pending bookings (AGENT_APPROVED only)
export const getPendingBookingsAdminApi = () =>
  axiosInstance.get("/admin/bookings/pending");

// Admin confirm / cancel booking
export const adminBookingDecisionApi = (bookingId, decision) =>
  axiosInstance.put(`/admin/bookings/${bookingId}/decision`, { decision });

/* ================= PAYMENTS ================= */

export const getAllPaymentsApi = () =>
  axiosInstance.get("/admin/payments");
