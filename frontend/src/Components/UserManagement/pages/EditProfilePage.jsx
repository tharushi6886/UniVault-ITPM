import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Homepage/Navbar";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    faculty: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await getProfile(token);

        setFormData({
          name: res.data.name || "",
          phone: res.data.phone || "",
          faculty: res.data.faculty || "",
        });
      } catch (error) {
        console.error("Fetch profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const res = await updateProfile(token, formData);

      const existingUser = JSON.parse(localStorage.getItem("user"));
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...existingUser,
          ...res.data.user,
        })
      );

      alert(res.data.message || "Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Update error:", error);
      const message =
        error.response?.data?.message || "Failed to update profile";
      alert(message);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex justify-center items-center pt-28">
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] p-8 border border-[#e9e7ff]">
          <h2 className="text-3xl font-bold text-center text-[#1f1b5b] mb-8">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#4f46e5]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#4f46e5]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Faculty
              </label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#4f46e5]"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="w-1/2 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-1/2 bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white py-3 rounded-xl font-semibold shadow-[0_6px_18px_rgba(79,70,229,0.24)]"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;