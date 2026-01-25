import axios from "axios";
import { getAuthHeader } from "../utils/auth";

const BASE_URL = "http://localhost:8080/api/bookings";

/* =========================
   CUSTOMER
========================= */

export const getMyBookingsApi = () => {
  return axios.get(`${BASE_URL}/customer`, getAuthHeader());
};

export const createBookingApi = (bookingData) => {
  return axios.post(`${BASE_URL}/create`, bookingData, getAuthHeader());
};

export const cancelBookingByCustomerApi = (bookingId) => {
  return axios.put(
    `${BASE_URL}/customer/cancel/${bookingId}`,
    {},
    getAuthHeader()
  );
};

/* =========================
   AGENT + ADMIN (SHARED)
========================= */

/**
 * decision values:
 * - AGENT_APPROVED
 * - AGENT_REJECTED
 * - CONFIRMED
 * - CANCELLED
 */
export const updateBookingStatusApi = (bookingId, decision) => {
  return axios.put(
    `${BASE_URL}/decision/${bookingId}`,
    { decision },
    getAuthHeader()
  );
};

/* =========================
   AGENT
========================= */

export const getBookingsForAgentApi = () => {
  return axios.get(`${BASE_URL}/agent`, getAuthHeader());
};

/* =========================
   ADMIN
========================= */

export const getAllBookingsAdminApi = () => {
  return axios.get(`${BASE_URL}/admin`, getAuthHeader());
};
