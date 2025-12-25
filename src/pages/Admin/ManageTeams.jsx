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
    captain: "",
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
      formDataToSend.append("captain", formData.captain);
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
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      captain: team.captain || "",
      playerCount: team.playerCount,
      matchesPlayed: team.matchesPlayed,
      logo: null,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (teamId) => {
    if (!window.confirm("Are you sure you want to delete this team?")) return;
    try {
      await api.delete(`/admin/teams/${teamId}`);
      fetchTeams();
    } catch {
      setError("Failed to delete team");
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingTeam(null);
    setFormData({
      name: "",
      captain: "",
      playerCount: "",
      matchesPlayed: "",
      logo: null,
    });
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
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-300"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </Link>

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

      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">
            {editingTeam ? "Edit Team" : "Add New Team"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Team Name" name="name" value={formData.name} onChange={handleInputChange} />
            <InputField label="Captain Name" name="captain" value={formData.captain} onChange={handleInputChange} />
            <InputField label="Player Count" name="playerCount" type="number" value={formData.playerCount} onChange={handleInputChange} />
            <InputField label="Matches Played" name="matchesPlayed" type="number" value={formData.matchesPlayed} onChange={handleInputChange} />

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Team Logo
              </label>

              <label
                htmlFor="teamLogo"
                className="inline-block cursor-pointer px-4 py-2 rounded-md
      bg-gray-200 dark:bg-gray-700
      text-gray-800 dark:text-gray-200
      hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Choose File
              </label>

              <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                {formData.logo ? formData.logo.name : "No file selected"}
              </span>

              <input
                id="teamLogo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="sm:col-span-2 flex space-x-2">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                {editingTeam ? "Update Team" : "Add Team"}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div key={team._id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {team.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Players: {team.playerCount}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Matches: {team.matchesPlayed}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Captain: {team.captain}
            </p>

            <div className="flex space-x-2 mt-3">
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
    </div>
  );
}

/* ------------------------ */
function InputField({ label, name, type = "text", value, onChange }) {
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
        text-gray-900 dark:text-gray-100"
      />
    </div>
  );
}
