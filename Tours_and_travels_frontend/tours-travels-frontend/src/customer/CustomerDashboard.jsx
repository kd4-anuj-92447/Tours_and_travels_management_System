import { useNavigate } from "react-router-dom";
import CustomerNavbar from "./CustomerNavbar";
const CustomerDashboard = () => {
  const navigate = useNavigate();

  return (
    <>
      <CustomerNavbar />
      <div style={{ paddingTop: "56px" }}></div>
      {/* HERO SECTION */}
      <section
        className="text-white text-center d-flex align-items-center"
        style={{
          minHeight: "75vh",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="container">
          <h1 className="fw-bold display-5 mb-3">
            Explore the World with Confidence
          </h1>
          <p className="lead mb-4">
            Discover amazing destinations, book tours easily, and manage your travel plans.
          </p>

          <button
            className="btn btn-warning btn-lg px-4"
            onClick={() => navigate("/customer/packages")}
          >
            Browse Packages
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container my-5">
        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body">
                <h5>Verified Agents</h5>
                <p className="text-muted">
                  All tour packages are managed by trusted and verified agents.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body">
                <h5>Secure Payments</h5>
                <p className="text-muted">
                  Make hassle-free and secure payments through the system.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card shadow-sm h-100 border-0">
              <div className="card-body">
                <h5>Easy Bookings</h5>
                <p className="text-muted">
                  Book tours in just a few clicks and track them anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerDashboard;
