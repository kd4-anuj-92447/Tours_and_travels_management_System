import { useLocation, useNavigate } from "react-router-dom";

const CustomerSearchResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const results = state?.results || [];

  return (
    <div className="container mt-4">
      <h4>Search Results</h4>

      <div className="row">
        {results.map(p => (
          <div className="col-md-4 mb-3" key={p.packageId}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5>{p.title}</h5>
                <p className="text-muted">{p.destination}</p>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate("/customer/payment", { state: { pkg: p } })}
                >
                  Book & Pay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerSearchResults;
