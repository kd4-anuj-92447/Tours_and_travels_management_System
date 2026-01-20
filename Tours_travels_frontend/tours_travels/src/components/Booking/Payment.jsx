import { useNavigate } from 'react-router-dom'

function Payment() {
  const navigate = useNavigate()

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow p-4 col-md-4">
        <h4 className="text-center mb-3">Payment Gateway</h4>

        <p className="text-center text-muted">
          Secure payment for your travel package
        </p>

        <div className="mb-3">
          <label className="form-label">Card Number</label>
          <input className="form-control" placeholder="XXXX XXXX XXXX XXXX" />
        </div>

        <div className="row">
          <div className="col">
            <label className="form-label">Expiry</label>
            <input className="form-control" placeholder="MM/YY" />
          </div>
          <div className="col">
            <label className="form-label">CVV</label>
            <input className="form-control" placeholder="***" />
          </div>
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">Payment Mode</label>
          <select className="form-select">
            <option>Credit Card</option>
            <option>Debit Card</option>
            <option>UPI</option>
            <option>Net Banking</option>
          </select>
        </div>

        <button
          className="btn btn-success w-100"
          onClick={() => navigate('/customer/confirmation')}
        >
          Pay Now
        </button>

        <p className="text-center text-success mt-3 mb-0">
          ✔ Secure Payment
        </p>
      </div>
    </div>
  )
}

export default Payment
