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
