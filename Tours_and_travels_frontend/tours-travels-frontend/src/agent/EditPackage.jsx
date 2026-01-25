import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  updatePackageApi,
  uploadPackageImagesApi,
} from "../api/agentApi";
import { toast } from "react-toastify";
import axios from "../api/axiosInstance";

const EditPackage = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD PACKAGE ================= */

  useEffect(() => {
    loadPackage();
  }, []);

  const loadPackage = async () => {
    try {
      const res = await axios.get(`/api/agent/packages/${packageId}`);
      const pkg = res.data;

      setForm({
        title: pkg.title,
        description: pkg.description,
        price: pkg.price,
      });

      setExistingImages(pkg.imageUrls || []);
    } catch (err) {
      toast.error("Failed to load package");
    }
  };

  /* ================= IMAGE HANDLING ================= */

  const handleFileChange = (e) => {
    const selected = [...e.target.files].slice(
      0,
      5 - existingImages.length
    );

    setNewFiles(selected);
    setPreviewUrls(selected.map((f) => URL.createObjectURL(f)));
  };

  const removeExistingImage = (url) => {
    setExistingImages(existingImages.filter((img) => img !== url));
  };

  /* ================= SUBMIT ================= */

  const submit = async () => {
    if (!form.title || !form.description || !form.price) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Update core package (status → PENDING)
      await updatePackageApi(packageId, {
        ...form,
        imageUrls: existingImages,
      });

      // 2️⃣ Upload new images (if any)
      if (newFiles.length > 0) {
        await uploadPackageImagesApi(packageId, newFiles);
      }

      toast.success("Package updated and sent for approval", {
        autoClose: 2000,
      });

      navigate("/agent/agent-packages");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update package");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3 className="mb-3">Edit Tour Package</h3>

        <input
          className="form-control mb-2"
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <textarea
          className="form-control mb-2"
          placeholder="Description"
          rows="3"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="number"
          className="form-control mb-3"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
        />

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <>
            <h6>Existing Images</h6>
            <div className="row mb-3">
              {existingImages.map((url, i) => (
                <div className="col-md-2 position-relative" key={i}>
                  <img
                    src={url}
                    className="img-fluid rounded"
                    style={{ height: "80px", objectFit: "cover" }}
                  />
                  <button
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    onClick={() => removeExistingImage(url)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* New Images */}
        <input
          type="file"
          multiple
          accept="image/*"
          className="form-control mb-3"
          onChange={handleFileChange}
        />

        {previewUrls.length > 0 && (
          <div className="row mb-3">
            {previewUrls.map((url, i) => (
              <div className="col-md-2" key={i}>
                <img
                  src={url}
                  className="img-fluid rounded"
                  style={{ height: "80px", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        )}

        <button
          className="btn btn-primary w-100"
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Package"}
        </button>
      </div>
    </div>
  );
};

export default EditPackage;
