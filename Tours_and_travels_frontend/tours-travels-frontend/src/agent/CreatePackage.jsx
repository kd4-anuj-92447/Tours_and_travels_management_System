import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPackageApi } from "../api/agentApi";

const CreatePackage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    durationDays: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createPackageApi(form);
    navigate("/agent/packages");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Travel Package</h3>

      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
        required
      />

      <input
        name="location"
        placeholder="Location"
        onChange={handleChange}
        required
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        onChange={handleChange}
        required
      />

      <input
        name="durationDays"
        type="number"
        placeholder="Duration (days)"
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleChange}
      />

      <div style={{ marginTop: "10px" }}>
        <button type="submit">Create Package</button>
        <button type="button" onClick={() => navigate("/agent/packages")}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreatePackage;
