import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Navbar from './../components/common/Navbar';
import { ThemeContext } from "../customer/CustomerThemeContext";

const Home = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext) || { theme: "day" };

  const heroStyle = {
    backgroundImage:
      theme === "night"
        ? "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop')"
        : "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "600px",
    display: "flex",
    alignItems: "center",
    color: theme === "night" ? "#fff" : "#000",
  };

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section style={heroStyle} className="text-center py-5">
        <div className="container">
          <h1 className="fw-bold display-3 mb-3" style={{ textShadow: theme === "night" ? "2px 2px 4px rgba(0,0,0,0.7)" : "none" }}>
            ✈️ Explore the World with Confidence
          </h1>
          <p className="lead mb-5" style={{ fontSize: "1.3rem", textShadow: theme === "night" ? "2px 2px 4px rgba(0,0,0,0.7)" : "none" }}>
            Discover amazing destinations, book tours, and manage
            your travel plans easily.
          </p>

          {/* GET STARTED BUTTON */}
          <button
            type="button"
            className="btn btn-primary btn-lg px-5 shadow-lg fw-bold"
            onClick={() => navigate("/login")}
          >
            🚀 Get Started Now
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className={`container py-5 ${theme === "night" ? "bg-dark" : ""}`}>
        <div className="text-center mb-5">
          <h2 className={`fw-bold display-5 ${theme === "night" ? "text-white" : "text-dark"}`}>
            🌟 Why Choose Us?
          </h2>
          <p className={`lead ${theme === "night" ? "text-light" : "text-muted"}`}>
            The best tours and travel management experience
          </p>
        </div>

        <div className="row g-4">
          {[
            {
              icon: "📱",
              title: "Easy Booking",
              description: "Book tours quickly with a secure and user-friendly process.",
              color: "primary"
            },
            {
              icon: "👨‍💼",
              title: "Trusted Agents",
              description: "Verified agents offering the best packages and deals.",
              color: "success"
            },
            {
              icon: "🔒",
              title: "Secure Payments",
              description: "Safe, transparent, and encrypted payment system.",
              color: "info"
            },
          ].map((feature, idx) => (
            <div className="col-md-4 mb-4" key={idx}>
              <div className={`card h-100 border-0 shadow-lg hover-lift ${theme === "night" ? "bg-secondary text-light" : ""}`}
                style={{ borderTop: `4px solid var(--bs-${feature.color})` }}>
                <div className="card-body text-center">
                  <div style={{ fontSize: "3rem" }} className="mb-3">{feature.icon}</div>
                  <h5 className="card-title fw-bold">{feature.title}</h5>
                  <p className={`card-text ${theme === "night" ? "text-light" : "text-muted"}`}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className={`py-5 ${theme === "night" ? "bg-dark" : "bg-light"}`}>
        <div className="container">
          <h2 className={`fw-bold display-5 ${theme === "night" ? "text-white" : "text-dark"}`}>
              ⭐ What Our Customers Say
            </h2>
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

      {/* CTA SECTION */}
      <section className={`py-5 text-center ${theme === "night" ? "bg-dark" : "bg-primary text-white"}`}>
        <div className="container">
          <h2 className={`fw-bold display-5 mb-3 ${theme === "night" ? "text-white" : ""}`}>
            Ready to Start Your Journey?
          </h2>
          <p className={`lead mb-4 ${theme === "night" ? "text-light" : ""}`}>
            Join thousands of travelers exploring the world with us
          </p>
          <button
            className="btn btn-warning btn-lg px-5 fw-bold shadow-lg"
            onClick={() => navigate("/login")}
          >
            🎫 Book Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`text-center py-4 ${theme === "night" ? "bg-black text-light" : "bg-dark text-light"}`}>
        <div className="container">
          <p className="mb-0">
            © 2024 Tours & Travels Management System. All rights reserved.
          </p>
          <p className="text-muted small mt-2">
            Making travel dreams come true, one booking at a time ✈️
          </p>
        </div>
      </footer>

      <style>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
    </>
  );
};

export default Home;
