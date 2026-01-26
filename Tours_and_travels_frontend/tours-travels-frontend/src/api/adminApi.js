import axios from "./axiosInstance";

/* ================= USERS (READ ONLY) ================= */
export const getAllUsersApi = () => {
  return axios.get("/admin/users");
};

/* ================= PACKAGES ================= */
export const getAllPackagesAdminApi = () => {
  return axios.get("/admin/packages");
};

export const approvePackageApi = (packageId) => {
  return axios.put(`/admin/packages/approve/${packageId}`);
};

export const rejectPackageApi = (packageId) => {
  return axios.put(`/admin/packages/reject/${packageId}`);
};

export const approveDeletePackageAdminApi = (packageId) =>
  axios.delete(`/admin/packages/${packageId}`);

/* ================= BOOKINGS ================= */
export const getAllBookingsAdminApi = () => {
  return axios.get("/admin/bookings");
};

export const confirmBookingAdminApi = (bookingId) => {
  return axios.put(`/admin/bookings/confirm/${bookingId}`);
};

export const getPendingPackagesAdminApi = () => {
  return axios.get("/admin/packages/pending");
};

export const cancelBookingByAdmin = (bookingId) => {
  return axios.put(`/admin/bookings/cancel/${bookingId}`);
};

/* ================= PAYMENTS ================= */
export const getAllPaymentsAdminApi = () => {
  return axios.get("/admin/payments");
};

export const confirmPaymentAdminApi = (paymentId) => {
  return axios.put(`/admin/payments/confirm/${paymentId}`);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getAuthHeader = () => {
  const token = getToken();

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};