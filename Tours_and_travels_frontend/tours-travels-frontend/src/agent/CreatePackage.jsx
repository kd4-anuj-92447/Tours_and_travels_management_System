import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createPackageApi,
  uploadPackageImagesApi,
  addPackageImageUrlsApi,
} from "../api/agentApi";
import { toast } from "react-toastify";

const CreatePackage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    destination: "",
    description: "",
    price: "",
    duration: "",
  });

  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [imageMode, setImageMode] = useState("file"); // "file" or "url"
  const [imageUrls, setImageUrls] = useState([]);
  const [currentUrl, setCurrentUrl] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE SELECTION ================= */

  const handleFileChange = (e) => {
    const selected = [...e.target.files].slice(0, 5);
    setFiles(selected);

    // local preview only
    const previews = selected.map((f) => URL.createObjectURL(f));
    setPreviewUrls(previews);
  };

  const addImageUrl = () => {
    if (!currentUrl.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }
    if (imageUrls.length >= 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImageUrls([...imageUrls, currentUrl]);
    setCurrentUrl("");
  };

  const removeImageUrl = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */

  const submit = async () => {
    if (!form.title || !form.destination || !form.description || !form.price || !form.duration) {
      toast.error("All fields are required");
      return;
    }

    // Check if at least one image source is provided
    if (imageMode === "file" && files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    if (imageMode === "url" && imageUrls.length === 0) {
      toast.error("Please add at least one image URL");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create package (PENDING)
      const pkgRes = await createPackageApi(form);
      const packageId = pkgRes.data.id;

      // 2️⃣ Upload images based on mode
      if (imageMode === "file") {
        await uploadPackageImagesApi(packageId, files);
      } else {
        await addPackageImageUrlsApi(packageId, imageUrls);
      }

      toast.success("Package submitted for admin approval!", {
        autoClose: 2000,
      });

      // Reset form
      setForm({ title: "", destination: "", description: "", price: "", duration: "" });
      setFiles([]);
      setPreviewUrls([]);
      setImageUrls([]);
      setCurrentUrl("");
      setImageMode("file");

      // Navigate to agent packages after 2 seconds
      setTimeout(() => {
        navigate("/agent/packages");
      }, 2000);

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create package");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">✨ Create New Tour Package</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate("/agent/packages")}
        >
          ← Back to Packages
        </button>
      </div>

      <div className="card shadow p-5" style={{ maxWidth: "700px", margin: "0 auto" }}>
        <p className="text-muted mb-4">Fill in the details below. Your package will be submitted for admin approval.</p>

        <input
          className="form-control mb-3"
          placeholder="Package Title (e.g., Kerala Backwaters Tour)"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          className="form-control mb-3"
          placeholder="Destination (e.g., Kerala, Goa, Shimla)"
          value={form.destination}
          onChange={(e) =>
            setForm({ ...form, destination: e.target.value })
          }
        />

        <textarea
          className="form-control mb-3"
          placeholder="Description (Include highlights, activities, itinerary details...)"
          rows="4"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <div className="row">
          <div className="col-md-6">
            <input
              type="number"
              className="form-control mb-3"
              placeholder="Price (₹)"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Duration (Days)"
              value={form.duration}
              onChange={(e) =>
                setForm({ ...form, duration: e.target.value })
              }
            />
          </div>
        </div>

        <label className="form-label fw-bold mt-2">📸 Package Images (Max 5)</label>

        {/* Image Mode Toggle */}
        <div className="btn-group w-100 mb-3" role="group">
          <input
            type="radio"
            className="btn-check"
            name="imageMode"
            id="modeFile"
            value="file"
            checked={imageMode === "file"}
            onChange={(e) => setImageMode(e.target.value)}
          />
          <label className="btn btn-outline-primary" htmlFor="modeFile">
            📤 Upload Files
          </label>

          <input
            type="radio"
            className="btn-check"
            name="imageMode"
            id="modeUrl"
            value="url"
            checked={imageMode === "url"}
            onChange={(e) => setImageMode(e.target.value)}
          />
          <label className="btn btn-outline-primary" htmlFor="modeUrl">
            🔗 Add URLs
          </label>
        </div>

        {/* FILE UPLOAD MODE */}
        {imageMode === "file" && (
          <>
            <input
              type="file"
              multiple
              accept="image/*"
              className="form-control mb-3"
              onChange={handleFileChange}
            />
            <small className="text-muted d-block mb-3">Upload clear, attractive images of the destination</small>

            {/* Image previews */}
            {previewUrls.length > 0 && (
              <div className="mb-4">
                <label className="form-label fw-bold">Preview:</label>
                <div className="row g-2">
                  {previewUrls.map((url, i) => (
                    <div className="col-md-3 col-sm-4 col-6" key={i}>
                      <img
                        src={url}
                        alt={`preview-${i}`}
                        className="img-fluid rounded border"
                        style={{ height: "120px", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* URL INPUT MODE */}
        {imageMode === "url" && (
          <>
            <div className="input-group mb-3">
              <input
                type="url"
                className="form-control"
                placeholder="https://example.com/image.jpg"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
              />
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={addImageUrl}
                disabled={imageUrls.length >= 5}
              >
                Add
              </button>
            </div>
            <small className="text-muted d-block mb-3">Paste image URLs directly from the web (Max 5 images)</small>

            {/* URL Preview List */}
            {imageUrls.length > 0 && (
              <div className="mb-4">
                <label className="form-label fw-bold">Added URLs:</label>
                <div className="row g-2">
                  {imageUrls.map((url, i) => (
                    <div className="col-md-3 col-sm-4 col-6" key={i}>
                      <div style={{ position: "relative" }}>
                        <img
                          src={url}
                          alt={`url-${i}`}
                          className="img-fluid rounded border"
                          style={{ height: "120px", objectFit: "cover", width: "100%" }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/120?text=Invalid+URL";
                          }}
                        />
                        <button
                          className="btn btn-sm btn-danger"
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                          }}
                          onClick={() => removeImageUrl(i)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="d-grid gap-2">
          <button
            className="btn btn-primary btn-lg"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "🔄 Submitting..." : "✨ Submit for Approval"}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/agent/packages")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePackage;
