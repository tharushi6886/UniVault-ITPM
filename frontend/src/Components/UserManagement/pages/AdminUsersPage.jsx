import React, { useEffect, useState } from "react";
import Navbar from "../../Homepage/Navbar";
import { getUsers, blockUser, unblockUser, deleteUser } from "../api/userApi";
import { toast } from "react-toastify";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getUsers(token);
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBlock = async (userId) => {
    if (!window.confirm("Are you sure you want to block this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await blockUser(token, userId);

      toast.success("User blocked successfully");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: "blocked" } : user
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to block user");
    }
  };

  const handleUnblock = async (userId) => {
    if (!window.confirm("Are you sure you want to unblock this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await unblockUser(token, userId);

      toast.success("User unblocked successfully");

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: "active" } : user
        )
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unblock user");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await deleteUser(token, userId);

      toast.success("User deleted successfully");

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#1f1b5b]">Admin User Management</h1>
            <p className="text-gray-500 mt-2">
              View and manage all registered users in the system
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] border border-[#e9e7ff] overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-500 text-lg">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-lg">No users found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#f8f8ff]">
                    <tr>
                      <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Name</th>
                      <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Email</th>
                      <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Student ID</th>
                      <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Role</th>
                      <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Status</th>
                      <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user, index) => (
                      <tr
                        key={user._id}
                        className={`border-t border-[#ecebff] ${index % 2 === 0 ? "bg-white" : "bg-[#fcfcff]"}`}
                      >
                        <td className="px-6 py-4 text-gray-700 font-medium">{user.name}</td>
                        <td className="px-6 py-4 text-gray-700">{user.email}</td>
                        <td className="px-6 py-4 text-gray-700">{user.studentId}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#eef2ff] text-[#4f46e5]">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : user.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 flex-wrap">
                            {user.status === "blocked" ? (
                              <button
                                onClick={() => handleUnblock(user._id)}
                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                              >
                                Unblock
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlock(user._id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                              >
                                Block
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(user._id)}
                              className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-black"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsersPage;