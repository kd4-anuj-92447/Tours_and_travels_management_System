import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updatePackageApi, getAgentPackagesApi } from "../api/agentApi";
import { toast } from "react-toastify";

const EditPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  useEffect(() => {
    loadPackage();
  }, []);

  const loadPackage = async () => {
    try {
      const res = await getAgentPackagesApi();
      const pkg = res.data.find((p) => String(p.id) === id);

      if (!pkg) {
        toast.error("Package not found");
        navigate("/agent/packages");
        return;
      }

      setForm(pkg);
    } catch (err) {
      toast.error("Failed to load package");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updatePackageApi(id, form);
      toast.success("Package updated");
      navigate("/agent/packages");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Edit Package</h3>

      <form onSubmit={handleUpdate}>
        <input
          name="name"
          className="form-control mb-2"
          value={form.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          className="form-control mb-2"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          name="duration"
          className="form-control mb-2"
          value={form.duration}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          className="form-control mb-3"
          value={form.price}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary">
          Update Package
        </button>
      </form>
    </div>
  );
};

export default EditPackage;
