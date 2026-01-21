export default function Packages() {
  return (
    <div className="container mt-4">
      <h3>Available Packages</h3>

      <div className="row">
        {["Goa Escape", "Manali Adventure", "Kerala Backwaters"].map((pkg, i) => (
          <div className="col-md-4" key={i}>
            <div className="card mb-3">
              <div className="card-body">
                <h5>{pkg}</h5>
                <p>5 Days | ₹20,000</p>
                <button className="btn btn-success">Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
