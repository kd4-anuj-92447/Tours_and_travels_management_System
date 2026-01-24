import CustomerNavbar from "./CustomerNavbar";
import { useEffect, useState } from "react";
import { getApprovedPackagesApi } from "../api/customerApi";

const CustomerPackages = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    getApprovedPackagesApi()
      .then(res => setPackages(res.data))
      .catch(() => setPackages([]));
  }, []);

  return (
    <>
      <CustomerNavbar />

      <div className="page-content">
        <div className="container mt-4">
          <h3>Available Packages</h3>

          {packages.length === 0 && (
            <p className="text-muted">No approved packages found.</p>
          )}

          <table className="table table-striped mt-3">
            <thead className="table-dark">
              <tr>
                <th>Title</th>
                <th>Destination</th>
                <th>Duration</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.packageId}>
                  <td>{pkg.title}</td>
                  <td>{pkg.destination}</td>
                  <td>{pkg.duration}</td>
                  <td>₹{pkg.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CustomerPackages;
