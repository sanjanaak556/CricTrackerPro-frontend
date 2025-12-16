import React, { useState } from "react";
import api from "../../../services/api";

const EditUserModal = ({ user, onClose, onUpdated }) => {
  const [role, setRole] = useState(user.role?.roleName);

  const handleUpdate = async () => {
    try {
      await api.patch(`/users/${user._id}/role`, { roleName: role });
      onUpdated();
    } catch (err) {
      console.error("Failed to update", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Edit User</h2>

        <div className="space-y-3">
          {/* Name */}
          <div>
            <label className="text-gray-600 dark:text-gray-300 text-sm">
              Name
            </label>
            <input
              type="text"
              value={user.name}
              disabled
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-600 dark:text-gray-300 text-sm">
              Email
            </label>
            <input
              type="text"
              value={user.email}
              disabled
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Role Dropdown */}
          <div>
            <label className="text-gray-600 dark:text-gray-300 text-sm">
              Role
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="scorer">Scorer</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 border rounded-lg dark:border-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
