import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function ManagePlayers() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    teamId: "",
    matchesPlayed: "",
    runs: "",
    wickets: "",
    average: "",
    image: null,
  });

  useEffect(() => {
    fetchPlayers();
    fetchTeams();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/players");
      setPlayers(response.players || []);
    } catch (err) {
      setError("Failed to load players");
      console.error("Players error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await api.get("/admin/teams");
      setTeams(response.teams || []);
    } catch (err) {
      console.error("Teams error:", err);
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
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      if (editingPlayer) {
        await api.put(`/admin/players/${editingPlayer._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/admin/players", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchPlayers();
    } catch (err) {
      setError("Failed to save player");
      console.error("Save player error:", err);
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      role: player.role,
      teamId: player.teamId?._id,
      matchesPlayed: player.matchesPlayed,
      runs: player.runs,
      wickets: player.wickets,
      average: player.average,
      image: null,
    });

    setShowAddForm(true);
  };

  const handleDelete = async (playerId) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      try {
        await api.delete(`/admin/players/${playerId}`);
        fetchPlayers();
      } catch (err) {
        setError("Failed to delete player");
        console.error("Delete player error:", err);
      }
    }
  };

  const resetForm = () => {
    setEditingPlayer(null);
    setShowAddForm(false);
    setFormData({
      name: "",
      role: "",
      teamId: "",
      matchesPlayed: "",
      runs: "",
      wickets: "",
      average: "",
      image: null,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin h-12 w-12 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-6">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/admin/dashboard"
        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-300 min-h-[44px] min-w-[44px]"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </Link>

      {/* Top section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Players
        </h1>

        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto min-h-[44px]"
        >
          Add Player
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="w-full max-w-full bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
            {editingPlayer ? "Edit Player" : "Add New Player"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="md:col-span-2">
                <InputField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <SelectField
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                options={["Batter", "Bowler", "All-Rounder", "Wicket-Keeper"]}
              />

              <SelectField
                label="Team"
                name="teamId"
                value={formData.teamId}
                onChange={handleInputChange}
                options={teams.map((t) => ({ value: t._id, label: t.name }))}
              />

              <InputField
                label="Matches Played"
                name="matchesPlayed"
                type="number"
                value={formData.matchesPlayed}
                onChange={handleInputChange}
              />
              <InputField
                label="Runs"
                name="runs"
                type="number"
                value={formData.runs}
                onChange={handleInputChange}
              />
              <InputField
                label="Wickets"
                name="wickets"
                type="number"
                value={formData.wickets}
                onChange={handleInputChange}
              />
              <InputField
                label="Average"
                name="average"
                type="number"
                step="0.01"
                value={formData.average}
                onChange={handleInputChange}
              />

              {/* Image upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium dark:text-gray-300">
                  Player Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-700 dark:text-gray-300
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border file:border-gray-300
                    file:bg-gray-100 dark:file:bg-gray-700
                    file:text-gray-700 dark:file:text-gray-300
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex-1 sm:flex-none min-h-[44px]">
                {editingPlayer ? "Update" : "Add Player"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 flex-1 sm:flex-none min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Players table - Responsive */}
      <div className="overflow-x-auto w-full rounded-lg shadow bg-white dark:bg-gray-800">
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {[
                  "Name",
                  "Team",
                  "Matches",
                  "Runs",
                  "Wickets",
                  "Avg",
                  "Actions",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {players.map((player) => (
                <tr key={player._id}>
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <img
                      src={player.image || "/default-player.png"}
                      alt={player.name}
                      className="h-10 w-10 rounded-full object-contain bg-gray-200"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium dark:text-gray-100">
                        {player.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {player.role}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm dark:text-gray-200">
                    {player.teamId?.name}
                  </td>

                  <td className="px-6 py-4 dark:text-gray-200">
                    {player.matchesPlayed}
                  </td>
                  <td className="px-6 py-4 dark:text-gray-200">{player.runs}</td>
                  <td className="px-6 py-4 dark:text-gray-200">
                    {player.wickets}
                  </td>
                  <td className="px-6 py-4 dark:text-gray-200">
                    {player.average}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEdit(player)}
                      className="text-indigo-600 dark:text-indigo-400 hover:underline mr-4 min-h-[44px] min-w-[44px]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(player._id)}
                      className="text-red-600 dark:text-red-400 hover:underline min-h-[44px] min-w-[44px]"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4 p-4">
          {players.map((player) => (
            <div 
              key={player._id} 
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow"
            >
              <div className="flex items-start space-x-3">
                <img
                  src={player.image || "/default-player.png"}
                  alt={player.name}
                  className="h-12 w-12 rounded-full object-contain bg-gray-200"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {player.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {player.role} • {player.teamId?.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Matches:</span>
                      <span className="font-medium dark:text-white">{player.matchesPlayed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Runs:</span>
                      <span className="font-medium dark:text-white">{player.runs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Wickets:</span>
                      <span className="font-medium dark:text-white">{player.wickets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Average:</span>
                      <span className="font-medium dark:text-white">{player.average}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex space-x-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => handleEdit(player)}
                      className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 text-sm font-medium min-h-[44px] min-w-[44px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(player._id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 text-sm font-medium min-h-[44px] min-w-[44px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {players.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-300 py-6">
            No players found.
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------- */
/* Reusable Inputs */
/* -------------- */

function InputField({ label, name, value, type = "text", step, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        step={step}
        name={name}
        value={value}
        onChange={onChange}
        required
        className="mt-1 block w-full px-3 py-2 rounded-md 
        bg-gray-50 dark:bg-gray-700 
        border border-gray-300 dark:border-gray-600
        text-gray-900 dark:text-gray-100
        focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="mt-1 block w-full px-3 py-2 rounded-md 
        bg-gray-50 dark:bg-gray-700 
        border border-gray-300 dark:border-gray-600
        text-gray-900 dark:text-gray-100
        focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Select</option>

        {Array.isArray(options) &&
          options.map((opt, i) =>
            typeof opt === "string" ? (
              <option key={i} value={opt}>
                {opt}
              </option>
            ) : (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            )
          )}
      </select>
    </div>
  );
}