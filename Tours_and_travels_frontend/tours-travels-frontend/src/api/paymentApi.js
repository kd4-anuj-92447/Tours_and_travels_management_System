import axiosInstance from "./axiosInstance";

/**
 * =========================
 * CUSTOMER PAYMENTS
 * =========================
 */
export const createPaymentApi = (paymentData) => {
  return axiosInstance.post("/payments", paymentData);
};

/**
 * Get logged-in customer's payments
 * GET /api/payments/my
 */
export const getMyPaymentsApi = () => {
  return axiosInstance.get("/payments/my");
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