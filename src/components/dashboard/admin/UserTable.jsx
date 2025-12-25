import React from "react";
import defaultAvatar from "../../../assets/avatar_img.jpg";

const UserTable = ({ users, onEdit, onDelete }) => {
  // Mobile Card View Component
  const MobileCardView = ({ user }) => (
    <div className="md:hidden bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={user.profileImage || defaultAvatar}
            className="w-12 h-12 rounded-full object-cover"
            alt="profile"
            onError={(e) => (e.target.src = defaultAvatar)}
          />
          <div>
            <h3 className="font-medium dark:text-white">{user.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded ${
            user.isActive
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
          }`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
          <p className="dark:text-white capitalize">
            {user.role?.roleName || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
          <p className="dark:text-white">
            {user.isActive ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          onClick={() => onEdit(user)}
        >
          Edit
        </button>
        <button
          className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          onClick={() => {
            if (
              window.confirm(`Are you sure you want to delete "${user.name}"?`)
            ) {
              onDelete(user._id);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden">
        {users.length === 0 ? (
          <div className="text-center py-8 dark:text-white text-gray-600">
            No users found
          </div>
        ) : (
          users.map((user) => <MobileCardView key={user._id} user={user} />)
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto shadow rounded-lg border dark:border-gray-700">
        <table className="min-w-full bg-white dark:bg-gray-900">
          <thead className="bg-gray-200 dark:bg-gray-800 dark:text-white">
            <tr>
              <th className="p-3 text-left">Profile</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-t dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <td className="p-3">
                  <img
                    src={u.profileImage || defaultAvatar}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="profile"
                    onError={(e) => (e.target.src = defaultAvatar)}
                  />
                </td>

                <td className="p-3 dark:text-white">{u.name}</td>
                <td className="p-3 dark:text-white">{u.email}</td>

                <td className="p-3 capitalize dark:text-white">
                  {u.role?.roleName}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-sm rounded ${
                      u.isActive
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      onClick={() => onEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete "${u.name}"?`
                          )
                        ) {
                          onDelete(u._id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-8 dark:text-white text-gray-600">
            No users found
          </div>
        )}
      </div>
    </>
  );
};

export default UserTable;