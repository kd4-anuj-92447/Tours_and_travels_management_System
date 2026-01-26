import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "./CustomerThemeContext";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const backgroundStyle = {
    backgroundImage:
      theme === "night"
        ? "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop')"
        : "linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    paddingTop: "3rem",
    paddingBottom: "3rem",
  };

  return (
    <div style={backgroundStyle}>
      <div className="container">
        {/* HERO SECTION */}
        <div className="text-center mb-5 py-5">
          <h1 className={`fw-bold display-4 mb-3 ${theme === "night" ? "text-white" : "text-dark"}`}>
            ✈️ Explore the World with Confidence
          </h1>
          <p className={`lead mb-4 ${theme === "night" ? "text-light" : "text-muted"}`}>
            Discover amazing destinations, book tours easily, and manage your travel plans.
          </p>

          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <button
              className="btn btn-warning btn-lg px-5 shadow-lg fw-bold"
              onClick={() => navigate("/customer/packages")}
            >
              🏖️ Browse Packages
            </button>
            <button
              className={`btn btn-outline-primary btn-lg px-5 shadow-lg fw-bold ${theme === "night" ? "text-light border-light" : ""}`}
              onClick={() => navigate("/customer/bookings")}
            >
              📅 My Bookings
            </button>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="row mb-5">
          {[
            {
              icon: "👨‍💼",
              title: "Verified Agents",
              description: "All tour packages are managed by trusted and verified agents.",
              color: "primary"
            },
            {
              icon: "🔒",
              title: "Secure Payments",
              description: "Make hassle-free and secure payments through the system.",
              color: "success"
            },
            {
              icon: "📱",
              title: "Easy Bookings",
              description: "Book tours in just a few clicks and track them anytime.",
              color: "info"
            },
          ].map((feature, idx) => (
            <div className="col-lg-4 col-md-6 mb-4" key={idx}>
              <div
                className={`card h-100 border-0 shadow-lg hover-lift ${theme === "night" ? "bg-dark text-light" : "bg-light"}`}
                style={{
                  borderTop: `4px solid var(--bs-${feature.color})`,
                  transition: "all 0.3s ease"
                }}
              >
                <div className="card-body text-center">
                  <div style={{ fontSize: "3rem" }} className="mb-3">
                    {feature.icon}
                  </div>
                  <h5 className={`card-title fw-bold ${theme === "night" ? "text-light" : "text-dark"}`}>
                    {feature.title}
                  </h5>
                  <p className={theme === "night" ? "text-light" : "text-muted"}>
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* QUICK STATS SECTION */}
        <div className="row mb-5">
          {[
            { label: "Destinations", value: "50+", icon: "🌍" },
            { label: "Happy Travelers", value: "1000+", icon: "😊" },
            { label: "Best Prices", value: "Guaranteed", icon: "💰" },
          ].map((stat, idx) => (
            <div className="col-md-4 mb-3" key={idx}>
              <div
                className={`text-center p-4 rounded shadow-lg ${theme === "night" ? "bg-dark" : "bg-white"}`}
              >
                <div style={{ fontSize: "2rem" }} className="mb-2">{stat.icon}</div>
                <h6 className={theme === "night" ? "text-light" : "text-muted"}>{stat.label}</h6>
                <h3 className="fw-bold text-primary">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
    </div>
  );
};

export default CustomerDashboard;
