"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: ""
  });
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/login";
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      bio: userData.bio || ""
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    // Mock save - replace with actual API call
    setMessage({ type: "success", text: "Profile updated successfully!" });
    setIsEditing(false);
    // Update localStorage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || ""
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <Link href="/chats" className="back-button">
            ←
          </Link>
          <h1 className="profile-title">Profile</h1>
        </div>

        {message && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-content">
          <div className="profile-avatar-section">
            <div className="avatar-placeholder large">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {!isEditing && (
              <button
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="profile-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              {isEditing ? (
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <p className="profile-value">{user.name}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              {isEditing ? (
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="profile-input"
                />
              ) : (
                <p className="profile-value">{user.email}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              {isEditing ? (
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="profile-textarea"
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="profile-value">{user.bio || "No bio yet"}</p>
              )}
            </div>

            {isEditing && (
              <div className="form-actions">
                <button className="save-button" onClick={handleSave}>
                  Save Changes
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            )}

            {!isEditing && (
              <div className="profile-actions">
                <button
                  className="logout-button"
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}