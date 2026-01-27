import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getCustomerProfileApi,
  updateCustomerProfileApi,
} from "../api/customerApi";

const CustomerProfile = () => {
  const [loading, setLoading] = useState(false);
  const [pictureMode, setPictureMode] = useState("file"); // "file" or "url"
  const [currentPictureUrl, setCurrentPictureUrl] = useState("");

  const [profile, setProfile] = useState({
    username: "",
    phone: "",
    address: "",
    profilePic: "",
  });

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    loadProfile();
  }, []);

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
      console.error("Failed to load profile", error);
      toast.error("Failed to load profile", { autoClose: 1000 });
    }
  };

  /* ================= IMAGE HANDLER ================= */
  const handlePicUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({
        ...prev,
        profilePic: reader.result, // base64
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePictureUrlChange = (url) => {
    if (!url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }
    setCurrentPictureUrl(url);
  };

  const applyPictureUrl = () => {
    if (currentPictureUrl.trim()) {
      setProfile((prev) => ({
        ...prev,
        profilePic: currentPictureUrl,
      }));
      setCurrentPictureUrl("");
      toast.success("Picture URL added");
    }
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

      toast.success("Profile updated successfully", {
        autoClose: 1000,
      });
    } catch (error) {
      console.error("Profile update failed", error);
      toast.error("Failed to update profile", { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "520px" }}>
        <h3 className="mb-3 text-center">My Profile</h3>

          {/* Profile Picture */}
          <div className="text-center mb-3">
            <img
              src={
                profile.profilePic ||
                "https://via.placeholder.com/120"
              }
              alt="Profile"
              className="rounded-circle mb-2 border"
              width="120"
              height="120"
              style={{ objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/120";
              }}
            />

            {/* Picture Mode Toggle */}
            <div className="btn-group d-flex mt-2" role="group" style={{ justifyContent: "center" }}>
              <input
                type="radio"
                className="btn-check"
                name="pictureMode"
                id="modePictureFile"
                value="file"
                checked={pictureMode === "file"}
                onChange={(e) => setPictureMode(e.target.value)}
              />
              <label className="btn btn-outline-primary btn-sm" htmlFor="modePictureFile">
                📤 Upload
              </label>

              <input
                type="radio"
                className="btn-check"
                name="pictureMode"
                id="modePictureUrl"
                value="url"
                checked={pictureMode === "url"}
                onChange={(e) => setPictureMode(e.target.value)}
              />
              <label className="btn btn-outline-primary btn-sm" htmlFor="modePictureUrl">
                🔗 URL
              </label>
            </div>

            {/* FILE UPLOAD MODE */}
            {pictureMode === "file" && (
              <input
                type="file"
                className="form-control mt-2"
                accept="image/*"
                onChange={handlePicUpload}
              />
            )}

            {/* URL INPUT MODE */}
            {pictureMode === "url" && (
              <div className="input-group mt-2">
                <input
                  type="url"
                  className="form-control form-control-sm"
                  placeholder="https://example.com/picture.jpg"
                  value={currentPictureUrl}
                  onChange={(e) => handlePictureUrlChange(e.target.value)}
                />
                <button
                  className="btn btn-outline-primary btn-sm"
                  type="button"
                  onClick={applyPictureUrl}
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Username */}
          <label className="form-label">Username</label>
          <input
            className="form-control mb-3"
            value={profile.username}
            onChange={(e) =>
              setProfile({ ...profile, username: e.target.value })
            }
          />

          {/* Phone */}
          <label className="form-label">Phone</label>
          <input
            className="form-control mb-3"
            value={profile.phone}
            onChange={(e) =>
              setProfile({ ...profile, phone: e.target.value })
            }
          />

          {/* Address */}
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
            disabled={loading}
            onClick={handleSave}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    );
  };
  
  export default CustomerProfile;
