// src/utils/auth.js

export const saveAuthData = (data) => {
  localStorage.setItem("token", data.token);

  // normalize role (string OR object)
  const role =
    typeof data.role === "string"
      ? data.role
      : data.role?.roleName;

  localStorage.setItem("role", role);

  // force UI update
  window.dispatchEvent(new Event("authChanged"));
};

export const logout = () => {
  localStorage.clear();
  window.dispatchEvent(new Event("authChanged"));
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const getUserRole = () => {
  return localStorage.getItem("role");
};

export const getRedirectPathByRole = (role) => {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "AGENT":
      return "/agent";
    case "CUSTOMER":
      return "/customer/packages";
    default:
      return "/";
  }
};

export const getDashboardPathByRole = (role) => {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "AGENT":
      return "/agent";
    case "CUSTOMER":
      return "/customer";
    default:
      return "/";
  }
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
