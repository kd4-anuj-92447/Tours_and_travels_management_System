import { Outlet } from "react-router-dom";
import { ThemeProvider } from "./CustomerThemeContext";
import CustomerNavbar from "./CustomerNavbar";

const CustomerLayout = () => {
  return (
    <ThemeProvider>
      <CustomerNavbar />
      <Outlet />
    </ThemeProvider>
  );
};

export default CustomerLayout;
