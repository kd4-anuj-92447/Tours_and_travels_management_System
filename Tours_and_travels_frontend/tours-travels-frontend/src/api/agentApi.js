import axiosInstance from "./axiosInstance";
/**
 * =========================
 * AGENT DASHBOARD APIs
 * =========================
 */

/**
 * GET agent's own packages
 * GET /api/agent/packages
 */
export const getAgentPackagesApi = () => {
  return axiosInstance.get("/agent/packages");
};

/**
 * Create a new package (agent only)
 */
export const createPackageApi = (packageData) => {
  return axiosInstance.post("/agent/packages", packageData);
};

/**
 * GET agent's own bookings
 * GET /api/agent/bookings
 */
export const getAgentBookingsApi = () => {
  return axiosInstance.get("/agent/bookings");
};

/**
 * Update package
 */
export const updatePackageApi = (packageId, packageData) => {
  return axiosInstance.put(`/agent/packages/${packageId}`, packageData);
};

/**
 * Delete package
 */
export const deletePackageApi = (packageId) => {
  return axiosInstance.delete(`/agent/packages/${packageId}`);
};
