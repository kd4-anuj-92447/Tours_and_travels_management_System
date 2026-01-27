import axios from "./axiosInstance";

/* ================= AGENT PACKAGES ================= */

//  Agent → View own packages
export const getMyPackagesApi = () =>
  axios.get("/agent/packages");

//  Agent → Create package
export const createPackageApi = (data) =>
  axios.post("/agent/packages", data);

//  Agent → Update package
export const updatePackageApi = (id, data) =>
  axios.put(`/agent/packages/${id}`, data);

//  Agent → Request delete (PENDING_DELETE)
export const deletePackageApi = (id) =>
  axios.delete(`/agent/packages/${id}`);

//  Agent → Upload images (File upload)
export const uploadPackageImagesApi = (packageId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  return axios.post(`/agent/packages/${packageId}/upload-images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Agent → Add package images via URLs (Direct URL submission)
export const addPackageImageUrlsApi = (packageId, imageUrls) =>
  axios.post(`/agent/packages/${packageId}/image-urls`, {
    imageUrls,
  });

/* ================= AGENT BOOKINGS ================= */

export const getAgentBookingsApi = () =>
  axios.get("/agent/bookings");

export const updateBookingStatusApi = (bookingId, decision) =>
  axios.put(`/agent/bookings/${bookingId}`, {
    decision,
  });
