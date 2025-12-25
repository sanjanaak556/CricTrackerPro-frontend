import React, { useEffect, useState } from "react";
import api from "../../services/api";
import UserTable from "../../components/dashboard/admin/UserTable";
import EditUserModal from "../../components/dashboard/admin/EditUserModal";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UsersAndRoles = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res);
      setFiltered(res);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search + Filter
  useEffect(() => {
    let data = [...users];

    // Search by name or email
    if (search.trim() !== "") {
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      data = data.filter((u) => u.role?.roleName === roleFilter);
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [search, roleFilter, users]);

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filtered.slice(indexOfFirst, indexOfLast);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Back link */}
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-300"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </Link>

      {/* Title */}
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Users & Roles</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-5">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-lg bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="all">All Roles</option>
          <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="admin">Admin</option>
          <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="scorer">Scorer</option>
          <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="viewer">Viewer</option>
        </select>
      </div>

      {/* Table */}
      <UserTable
        users={currentUsers}
        onEdit={(user) => setSelectedUser(user)}
        onDelete={async (id) => {
          await api.delete(`/users/${id}`);
          fetchUsers();
        }}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 border rounded-lg dark:border-gray-600"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>

        <p className="dark:text-white">
          Page {currentPage} of {Math.ceil(filtered.length / usersPerPage)}
        </p>

        <button
          className="px-4 py-2 border rounded-lg dark:border-gray-600"
          disabled={indexOfLast >= filtered.length}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdated={() => {
            setSelectedUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

export default UsersAndRoles;