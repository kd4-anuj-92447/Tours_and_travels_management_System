export const loginUser = (email) => {
  const user =
    email === "admin@tours.com"
      ? { role: "ADMIN", name: "Admin" }
      : { role: "USER", name: "Customer" };

  localStorage.setItem("user", JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};

export const getUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("user");
};
