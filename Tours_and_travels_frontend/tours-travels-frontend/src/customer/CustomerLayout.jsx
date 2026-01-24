import CustomerNavbar from "../customer/CustomerNavbar";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  return (
    <>
      <CustomerNavbar />
      <Outlet />
    </>
  );
};

export default CustomerLayout;
