import { useState } from "react";
import {
  createPackageApi,
  uploadPackageImagesApi,
} from "../api/agentApi";
import { toast } from "react-toastify";

const CreatePackage = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= IMAGE SELECTION ================= */

  const handleFileChange = (e) => {
    const selected = [...e.target.files].slice(0, 5);
    setFiles(selected);

    // local preview only
    const previews = selected.map((f) => URL.createObjectURL(f));
    setPreviewUrls(previews);
  };

  /* ================= SUBMIT ================= */

  const submit = async () => {
    if (!form.title || !form.description || !form.price) {
      toast.error("All fields are required");
      return;
    }

    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create package (PENDING)
      const pkgRes = await createPackageApi(form);
      const packageId = pkgRes.data.id;

      // 2️⃣ Upload images
      await uploadPackageImagesApi(packageId, files);

      toast.success("Package submitted for admin approval", {
        autoClose: 2000,
      });

      // reset form
      setForm({ title: "", description: "", price: "" });
      setFiles([]);
      setPreviewUrls([]);

    } catch (err) {
      console.error(err);
      toast.error("Failed to create package");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3 className="mb-3">Create Tour Package</h3>

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

        <input
          type="file"
          multiple
          accept="image/*"
          className="form-control mb-3"
          onChange={handleFileChange}
        />

        {/* Image previews */}
        {previewUrls.length > 0 && (
          <div className="row mb-3">
            {previewUrls.map((url, i) => (
              <div className="col-md-2" key={i}>
                <img
                  src={url}
                  alt="preview"
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
          {loading ? "Submitting..." : "Submit for Approval"}
        </button>
      </div>
    </div>
  );
};

export default CreatePackage;
