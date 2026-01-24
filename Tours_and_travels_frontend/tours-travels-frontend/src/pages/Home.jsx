import { useNavigate } from "react-router-dom";
import Navbar from './../components/common/Navbar';
const Home = () => {
  const navigate = useNavigate();

  return (
    <>
    <Navbar />
      {/* HERO SECTION */}
      <section className="bg-light text-center py-5">
        <div className="container">
          <h1 className="fw-bold mb-3">
            Explore the World with Confidence
          </h1>
          <p className="lead mb-4">
            Discover amazing destinations, book tours, and manage
            your travel plans easily.
          </p>

          {/* GET STARTED BUTTON */}
          <button
            type="button"              // 🔐 REQUIRED
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/login")}
          >
            Get Started
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="container py-5">
        <h2 className="text-center mb-4">Why Choose Us?</h2>
        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5>Easy Booking</h5>
                <p>Book tours quickly with a secure process.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5>Trusted Agents</h5>
                <p>Verified agents offering the best packages.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5>Secure Payments</h5>
                <p>Safe and transparent payment system.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="bg-light py-5 text-center">
        <div className="container">
          <h2 className="mb-4">What Our Customers Say</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <p>“Amazing experience!”</p>
                  <strong>- Rahul</strong>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <p>“Best booking platform.”</p>
                  <strong>- Anjali</strong>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <p>“Excellent support team.”</p>
                  <strong>- Aman</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark text-light text-center py-3">
        © 2026 Tours & Travels Management System
      </footer>
    </>
  );
};

export default Home;
