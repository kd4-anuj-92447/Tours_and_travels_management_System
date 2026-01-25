import axios from "./axiosInstance";

/* ================= AGENT PACKAGES ================= */

// ✅ Agent → View own packages
export const getMyPackagesApi = () =>
  axios.get("/api/agent/packages");

// ✅ Agent → Create package
export const createPackageApi = (data) =>
  axios.post("/api/agent/packages", data);

// ✅ Agent → Update package
export const updatePackageApi = (id, data) =>
  axios.put(`/api/agent/packages/${id}`, data);

// ✅ Agent → Request delete (PENDING_DELETE)
export const deletePackageApi = (id) =>
  axios.delete(`/api/agent/packages/${id}`);

// ✅ Agent → Upload images
export const uploadPackageImagesApi = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  return axios.post("/api/agent/packages/upload-images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/* ================= AGENT BOOKINGS ================= */

export const getAgentBookingsApi = () =>
  axios.get("/api/agent/bookings");

export const updateBookingStatusApi = (bookingId, decision) =>
  axios.put(`/api/agent/bookings/${bookingId}`, {
    decision,
  });
