import React, { useEffect, useState } from "react";
import { getTourById, updateTour } from "../api/tourApi";
import { useParams, useNavigate } from "react-router-dom";

const EditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);

  useEffect(() => {
    getTourById(id).then((res) => setTour(res.data));
  }, [id]);

  const handleChange = (e) =>
    setTour({ ...tour, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateTour(id, tour);
    navigate("/agent/tours");
  };

  if (!tour) return null;

  return (
    <div className="container">
      <h2>Edit Tour</h2>

      <form onSubmit={handleSubmit}>
        <input name="price" value={tour.price} onChange={handleChange} />
        <input name="seats" value={tour.seats} onChange={handleChange} />

        <select
          name="active"
          value={tour.active}
          onChange={(e) =>
            setTour({ ...tour, active: e.target.value === "true" })
          }
        >
          <option value="true">Active</option>
          <option value="false">Disabled</option>
        </select>

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditTour;
