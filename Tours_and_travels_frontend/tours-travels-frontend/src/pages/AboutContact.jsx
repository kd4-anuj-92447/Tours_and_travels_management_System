const AboutContact = () => {
  return (
    <div className="container my-5">
      {/* ABOUT US SECTION */}
      <div className="row mb-5">
        <div className="col-md-12">
          <h2 className="mb-3">About Us</h2>
          <p>
            Welcome to <strong>Tours & Travels Management System</strong>. We
            are a one-stop platform that connects customers, travel agents, and
            administrators to provide seamless travel planning and booking
            experiences.
          </p>
          <p>
            Our mission is to simplify tour package discovery, booking, and
            management while ensuring transparency, reliability, and customer
            satisfaction.
          </p>

          <ul>
            <li>Verified travel agents</li>
            <li>Secure booking & payment system</li>
            <li>Wide range of tourist destinations</li>
            <li>Role-based dashboards (Admin, Agent, Customer)</li>
          </ul>
        </div>
      </div>

      {/* CONTACT US SECTION */}
      <div className="row">
        <div className="col-md-6">
          <h2 className="mb-3">Contact Us</h2>

          <p>
            Have questions, need help, or want to plan your next adventure?
            Reach out to us!
          </p>

          <p>
            <strong>Email:</strong> support@tourstravels.com
          </p>
          <p>
            <strong>Phone:</strong> +91 98765 43210
          </p>
          <p>
            <strong>Address:</strong> Pune, Maharashtra, India
          </p>
        </div>

        <div className="col-md-6">
          <h4 className="mb-3">Send us a message</h4>

          <form>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Enter your message"
              ></textarea>
            </div>

            <button type="button" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AboutContact;
