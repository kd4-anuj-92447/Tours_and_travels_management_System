import axiosInstance from "./axiosInstance";

/**
 * LOGIN (ALL ROLES)
 * POST /api/auth/login
 * Response: { token, role }
 */
export const loginApi = (email, password) => {
  return axiosInstance.post("/auth/login", {
    email,
    password,
  });
};

/**
 * CUSTOMER REGISTRATION (PUBLIC)
 * POST /api/auth/register
 */
export const registerCustomerApi = (user) => {
  return axiosInstance.post("/auth/register", user);
};

/**
 * LOGOUT (frontend only)
 */
export const logoutApi = () => {
  localStorage.clear();
  window.location.href = "/login";
};
