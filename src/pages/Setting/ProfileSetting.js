import React, { useState } from "react";
import "./setting.css";

const ProfileSetting = () => {
  const [avatar, setAvatar] = useState(
    "https://via.placeholder.com/100x100.png?text=Avatar"
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "User",
    bio: "",
  });

  const [saving, setSaving] = useState(false);

  // Handle avatar upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  // Save handler
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert("Profile updated successfully!");
      console.log("Profile updated:", { ...formData, avatar });
    }, 800);
  };

  // Reset handler
  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      role: "User",
      bio: "",
    });
    setAvatar("https://via.placeholder.com/100x100.png?text=Avatar");
  };

  return (
    <section className="page-grid">
      {/* Main Profile Card */}
      <div className="card profile-card">
        <div className="card-header">
          <h2>Profile Settings</h2>
          <p className="muted">
            Update your personal details, contact info, and avatar.
          </p>
        </div>

        {/* Avatar Upload */}
        <div className="profile-avatar">
          <img src={avatar} alt="User Avatar" />
          <div className="avatar-upload">
            <input
              type="file"
              id="avatarUpload"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="avatarUpload">Upload New Photo</label>
            <p className="muted-text">PNG, JPG under 2MB</p>
          </div>
        </div>

        {/* Profile Form */}
        <form className="form" onSubmit={handleSubmit} noValidate>
          <label className="form-group">
            <span className="label-text">Full name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Enter your full name"
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-group">
            <span className="label-text">Email address</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="you@example.com"
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-group">
            <span className="label-text">Role</span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option>User</option>
              <option>Admin</option>
              <option>Developer</option>
            </select>
          </label>

          <label className="form-group">
            <span className="label-text">Bio</span>
            <input
              type="text"
              name="bio"
              value={formData.bio}
              placeholder="Tell something about yourself"
              onChange={handleChange}
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <aside className="card info-card">
        <h3>Profile Tips</h3>
        <ul className="info-list">
          <li>Use an email you check frequently.</li>
          <li>Keep your name consistent for audit logs.</li>
          <li>Choose a clear profile picture for recognition.</li>
          <li>Enable 2FA for extra account security (if available).</li>
        </ul>
      </aside>
    </section>
  );
};

export default ProfileSetting;
