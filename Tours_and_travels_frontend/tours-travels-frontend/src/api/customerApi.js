import axios from "./axiosInstance";

/* ================= PACKAGES ================= */

/**
 * Get ONLY approved packages for customers
 */
export const getApprovedPackagesApi = () => {
  return axios.get("/customer/packages");
};

/**
 * Get single package details (optional – for future package detail page)
 */
export const getPackageByIdCustomerApi = (packageId) => {
  return axios.get(`/customer/packages/${packageId}`);
};

/**
 * Search packages by destination or title
 */
export const searchPackagesApi = (query) => {
  return axios.get(`/customer/packages/search`, {
    params: { q: query }
  });
};

/**
 * Get packages by destination
 */
export const getPackagesByDestinationApi = (destination) => {
  return axios.get(`/customer/packages/destination/${destination}`);
};

/* ================= BOOKINGS ================= */

/**
 * Create a booking for a package
 * Status will be PENDING (admin confirmation required)
 */
export const createBookingCustomerApi = (packageId) => {
  return axios.post(`/customer/bookings/${packageId}`);
};

/**
 * Get all bookings of logged-in customer
 */
export const getMyBookingsCustomerApi = () => {
  return axios.get("/customer/bookings");
};

/* ================= PAYMENTS ================= */

export const createPaymentApi = (bookingId) => {
  return axios.post(`/customer/payments/${bookingId}`);
};

/* ================= PROFILE ================= */
export const getCustomerProfileApi = () => {
  return axios.get("/customer/profile");
};

/**
 * Update customer profile (username, phone, address, profilePicUrl)
 */
export const updateCustomerProfileApi = (data) => {
  return axios.put("/customer/profile", data);
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