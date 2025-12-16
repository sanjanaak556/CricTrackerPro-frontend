import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ManageTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    playerCount: "",
    matchesPlayed: "",
    logo: null,
  });

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/teams");
      setTeams(response.teams || []);
    } catch (err) {
      setError("Failed to load teams");
      console.error("Teams error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      logo: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("playerCount", formData.playerCount);
      formDataToSend.append("matchesPlayed", formData.matchesPlayed);
      if (formData.logo) formDataToSend.append("logo", formData.logo);

      if (editingTeam) {
        await api.put(`/admin/teams/${editingTeam._id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/admin/teams", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchTeams();
    } catch (err) {
      setError("Failed to save team");
      console.error("Save team error:", err);
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      playerCount: team.playerCount,
      matchesPlayed: team.matchesPlayed,
      logo: null,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (teamId) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      try {
        await api.delete(`/admin/teams/${teamId}`);
        fetchTeams();
      } catch (err) {
        setError("Failed to delete team");
        console.error("Delete team error:", err);
      }
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingTeam(null);
    setFormData({ name: "", playerCount: "", matchesPlayed: "", logo: null });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-300"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </Link>

      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Manage Teams
        </h1>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add New Team
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full overflow-hidden">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">
            {editingTeam ? "Edit Team" : "Add New Team"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <InputField
              label="Team Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
            />

            {/* Player Count */}
            <InputField
              label="Player Count"
              name="playerCount"
              type="number"
              value={formData.playerCount}
              onChange={handleInputChange}
            />

            {/* Matches Played */}
            <InputField
              label="Matches Played"
              name="matchesPlayed"
              type="number"
              value={formData.matchesPlayed}
              onChange={handleInputChange}
            />

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Team Logo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-700 dark:text-gray-300
             file:mr-4 file:py-2 file:px-4
             file:rounded-lg file:border file:border-gray-300
             file:bg-gray-100 dark:file:bg-gray-700
             file:text-gray-700 dark:file:text-gray-300"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                {editingTeam ? "Update Team" : "Add Team"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={team.logo || "/default-team-logo.png"}
                alt={team.name}
                className="w-16 h-16 rounded-full object-contain bg-gray-200"
              />

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {team.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Players: {team.playerCount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Matches: {team.matchesPlayed}
                </p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(team)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(team._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No teams found. Click “Add New Team” to create your first team.
        </div>
      )}
    </div>
  );
}

/* ------------------------ */
/* Reusable Input Component */
/* ------------------------ */
function InputField({ label, name, type, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700
                   border border-gray-300 dark:border-gray-600
                   text-gray-900 dark:text-gray-100
                   focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  );
}
