import { useEffect, useState } from "react";
import { getAllTours, approveTour, disableTour } from "../api/adminApi";
import { toast } from "react-toastify";

const ManageToursAdmin = () => {
  const [tours, setTours] = useState([]);

  const load = () =>
    getAllTours().then(res => setTours(res.data));

  useEffect(load, []);

  return (
    <div className="container mt-4">
      <h3>🗺️ Manage Tours</h3>

      <table className="table table-hover table-striped shadow">
        <thead className="table-primary">
          <tr>
            <th>Tour</th>
            <th>Agent</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tours.map(t => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>{t.agentName}</td>
              <td>
                <span className={`badge bg-${t.approved ? "success" : "warning"}`}>
                  {t.approved ? "Approved" : "Pending"}
                </span>
              </td>
              <td>
                {!t.approved && (
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={async () => {
                      await approveTour(t._id);
                      toast.success("Tour approved");
                      load();
                    }}
                  >
                    Approve
                  </button>
                )}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={async () => {
                    await disableTour(t._id);
                    toast.warn("Tour disabled");
                    load();
                  }}
                >
                  Disable
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageToursAdmin;
