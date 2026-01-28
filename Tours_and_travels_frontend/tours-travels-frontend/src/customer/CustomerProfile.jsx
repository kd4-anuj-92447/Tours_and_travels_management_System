import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  getCustomerProfileApi,
  updateCustomerProfileApi,
} from "../api/customerApi";

const CustomerProfile = () => {
  const [loading, setLoading] = useState(false);
  const [pictureMode, setPictureMode] = useState("file"); // file | url
  const [currentPictureUrl, setCurrentPictureUrl] = useState("");

  const [profile, setProfile] = useState({
    username: "",
    phone: "",
    address: "",
    profilePic: "",
  });

  const hasLoaded = useRef(false);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const loadProfile = async () => {
      try {
        const res = await getCustomerProfileApi();

        setProfile({
          username: res.data.name || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          profilePic: res.data.profilePicUrl || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
      }
    };

    loadProfile();
  }, []);

  /* ================= IMAGE HANDLING ================= */
  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        profilePic: reader.result, // base64
      }));
    };
    reader.readAsDataURL(file);
  };

  const applyPictureUrl = () => {
    if (!currentPictureUrl.trim()) {
      toast.error("Please enter a valid image URL");
      return;
    }

    setProfile((prev) => ({
      ...prev,
      profilePic: currentPictureUrl.trim(),
    }));

    setCurrentPictureUrl("");
    toast.success("Profile picture updated");
  };

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    try {
      setLoading(true);

      await updateCustomerProfileApi({
        name: profile.username,
        phone: profile.phone,
        address: profile.address,
        profilePicUrl: profile.profilePic,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="container mt-4">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "520px" }}>
        <h3 className="mb-3 text-center">👤 My Profile</h3>

        {/* PROFILE PICTURE */}
        <div className="text-center mb-3">
          <img
            src={profile.profilePic || "https://via.placeholder.com/120"}
            alt="Profile"
            className="rounded-circle border mb-2"
            width="120"
            height="120"
            style={{ objectFit: "cover" }}
            onError={(e) =>
              (e.target.src = "https://via.placeholder.com/120")
            }
          />

          {/* MODE TOGGLE */}
          <div className="btn-group mt-2">
            <input
              type="radio"
              className="btn-check"
              name="pictureMode"
              id="fileMode"
              checked={pictureMode === "file"}
              onChange={() => setPictureMode("file")}
            />
            <label className="btn btn-outline-primary btn-sm" htmlFor="fileMode">
              Upload
            </label>

            <input
              type="radio"
              className="btn-check"
              name="pictureMode"
              id="urlMode"
              checked={pictureMode === "url"}
              onChange={() => setPictureMode("url")}
            />
            <label className="btn btn-outline-primary btn-sm" htmlFor="urlMode">
              URL
            </label>
          </div>

          {/* FILE UPLOAD */}
          {pictureMode === "file" && (
            <input
              type="file"
              className="form-control mt-2"
              accept="image/*"
              onChange={handlePicUpload}
            />
          )}

          {/* URL INPUT */}
          {pictureMode === "url" && (
            <div className="input-group mt-2">
              <input
                type="url"
                className="form-control form-control-sm"
                placeholder="https://example.com/image.jpg"
                value={currentPictureUrl}
                onChange={(e) => setCurrentPictureUrl(e.target.value)}
              />
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={applyPictureUrl}
              >
                Apply
              </button>
            </div>
          )}
        </div>

        {/* NAME */}
        <label className="form-label">Name</label>
        <input
          className="form-control mb-3"
          value={profile.username}
          onChange={(e) =>
            setProfile({ ...profile, username: e.target.value })
          }
        />

        {/* PHONE */}
        <label className="form-label">Phone</label>
        <input
          className="form-control mb-3"
          value={profile.phone}
          onChange={(e) =>
            setProfile({ ...profile, phone: e.target.value })
          }
        />

        {/* ADDRESS */}
        <label className="form-label">Address</label>
        <textarea
          className="form-control mb-4"
          rows="3"
          value={profile.address}
          onChange={(e) =>
            setProfile({ ...profile, address: e.target.value })
          }
        />

        <button
          className="btn btn-success w-100"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default CustomerProfile;
