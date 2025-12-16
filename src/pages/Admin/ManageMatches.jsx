import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { ArrowLeft, Eye } from "lucide-react";

function ManageMatches() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editMatchId, setEditMatchId] = useState(null);

  const [formData, setFormData] = useState({
    matchNumber: "",
    matchName: "",
    matchType: "T20",
    teamA: "",
    teamB: "",
    overs: 20,
    venue: { name: "", city: "", groundType: "" },
    umpires: [{ name: "", role: "on-field" }],
    scorerId: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchMatches();
  }, [filter]);

  const fetchData = async () => {
    try {
      const [matchesRes, teamsRes, usersRes] = await Promise.all([
        api.get("/matches"),
        api.get("/teams"),
        api.get("/users"),
      ]);
      setMatches(matchesRes);
      setTeams(teamsRes);
      setUsers(usersRes);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await api.get(`/matches?status=${filter}`);
      setMatches(response);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  // CREATE MATCH SUBMIT
  const handleCreateMatch = async (e) => {
    e.preventDefault();
    try {
      await api.post("/matches", formData);
      setShowCreateForm(false);

      setFormData({
        matchNumber: "",
        matchName: "",
        matchType: "T20",
        teamA: "",
        teamB: "",
        overs: 20,
        venue: { name: "", city: "", groundType: "" },
        umpires: [{ name: "", role: "on-field" }],
        scorerId: "",
      });

      fetchMatches();
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  // EDIT BUTTON CLICK
  const handleEditMatch = (match) => {
    setEditMatchId(match._id);
    setShowEditForm(true);
    setShowCreateForm(false);

    setFormData({
      matchNumber: match.matchNumber,
      matchName: match.matchName,
      matchType: match.matchType,
      teamA: match.teamA?._id,
      teamB: match.teamB?._id,
      overs: match.overs,
      venue: {
        name: match.venue?.name || "",
        city: match.venue?.city || "",
        groundType: match.venue?.groundType || "",
      },
      umpires:
        Array.isArray(match.umpires) && match.umpires.length > 0
          ? match.umpires.map((u) => ({
              name: u.name || "",
              role: u.role || "on-field",
            }))
          : [{ name: "", role: "on-field" }],
      scorerId: match.scorerId?._id || "",
    });
  };

  // UPDATE MATCH SUBMIT
  const handleUpdateMatch = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/matches/${editMatchId}`, formData);
      setShowEditForm(false);
      setEditMatchId(null);

      fetchMatches();
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  const handleEndMatch = async (matchId) => {
    try {
      await api.put(`/matches/${matchId}/complete`);
      fetchMatches();
    } catch (error) {
      console.error("Error ending match:", error);
    }
  };

  // DELETE MATCH (only for upcoming)
  const handleDeleteMatch = async (matchId) => {
    if (!window.confirm("Are you sure you want to delete this match?")) return;
    try {
      await api.delete(`/matches/${matchId}`);
      fetchMatches();
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  const handleViewLive = (matchId) => navigate(`/viewer/live/${matchId}`);
  const handleViewSummary = (matchId) =>
    navigate(`/viewer/scorecard/${matchId}`);

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200";
      case "live":
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "completed":
        return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const scorers = users.filter((u) => u.role?.roleName === "scorer");

  if (loading) {
    return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
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
          Manage Matches
        </h1>

        <button
          onClick={() => {
            setShowCreateForm(true);
            setShowEditForm(false);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create New Match
        </button>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex space-x-2">
        {["all", "upcoming", "live", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* CREATE FORM */}
      {showCreateForm && (
        <FormComponent
          title="Create New Match"
          formData={formData}
          setFormData={setFormData}
          teams={teams}
          scorers={scorers}
          handleSubmit={handleCreateMatch}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* EDIT FORM */}
      {showEditForm && (
        <FormComponent
          title="Edit Match"
          formData={formData}
          setFormData={setFormData}
          teams={teams}
          scorers={scorers}
          handleSubmit={handleUpdateMatch}
          onCancel={() => {
            setShowEditForm(false);
            setEditMatchId(null);
          }}
        />
      )}

      {/* MATCHES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <div
            key={match._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {/* Team A logo */}
                <img
                  src={match.teamA?.logo || "/default-team.png"}
                  alt={match.teamA?.name || "Team A"}
                  className="h-10 w-10 rounded object-cover"
                />

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {match.matchName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Match #{match.matchNumber}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {match.matchType} • {match.overs} overs
                  </p>
                </div>

                {/* Team B logo */}
                <img
                  src={match.teamB?.logo || "/default-team.png"}
                  alt={match.teamB?.name || "Team B"}
                  className="h-10 w-10 rounded object-cover ml-3"
                />
              </div>

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  match.status
                )}`}
              >
                {match.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-medium">{match.teamA?.name}</span> vs{" "}
                <span className="font-medium">{match.teamB?.name}</span>
              </p>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                {match.venue?.name}, {match.venue?.city}
              </p>

              {match.venue?.groundType && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ground Type: {match.venue.groundType}
                </p>
              )}

              {match.scorerId && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Scorer: {match.scorerId.name}
                </p>
              )}
            </div>

            {/* Umpires list */}
            {Array.isArray(match.umpires) && match.umpires.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium dark:text-gray-200">
                  Umpires:
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc ml-5">
                  {match.umpires.map((u, idx) => (
                    <li key={idx}>
                      {u.name} {u.role ? `(${u.role})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {match.status === "live" && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Current Score: {match.currentScore?.runs}/
                  {match.currentScore?.wickets} ({match.currentScore?.overs})
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/admin/matches/view/${match._id}`)}
                className="bg-gray-700 text-pink-300 px-3 py-1 rounded text-sm hover:bg-gray-800 flex items-center gap-1"
              >
                <Eye className="w-5 h-5 mr-1" /> 
              </button>

              {/* EDIT BUTTON ONLY FOR UPCOMING */}
              {match.status === "upcoming" && (
                <>
                  <button
                    onClick={() => handleEditMatch(match)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  {/* DELETE BUTTON ONLY FOR UPCOMING */}
                  <button
                    onClick={() => handleDeleteMatch(match._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </>
              )}

              {match.status === "live" && (
                <>
                  <button
                    onClick={() => handleViewLive(match._id)}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    View Live
                  </button>

                  <button
                    onClick={() => handleEndMatch(match._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    End Match
                  </button>
                </>
              )}

              {match.status === "completed" && (
                <button
                  onClick={() => handleViewSummary(match._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  View Summary
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {matches.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-300 py-8">
          No matches found. Click “Create New Match” to add your first match.
        </div>
      )}
    </div>
  );
}

/* ---- REUSABLE FORM (USED FOR CREATE + EDIT) ---- */

function FormComponent({
  title,
  formData,
  setFormData,
  teams,
  scorers,
  handleSubmit,
  onCancel,
}) {
  // Helpers to manage multiple umpires
  const updateUmpire = (idx, key, value) => {
    const copy = [...(formData.umpires || [])];
    copy[idx] = {
      ...(copy[idx] || { name: "", role: "on-field" }),
      [key]: value,
    };
    setFormData({ ...formData, umpires: copy });
  };

  const addUmpire = () => {
    const copy = [...(formData.umpires || [])];
    copy.push({ name: "", role: "on-field" });
    setFormData({ ...formData, umpires: copy });
  };

  const removeUmpire = (idx) => {
    const copy = [...(formData.umpires || [])];
    copy.splice(idx, 1);
    setFormData({
      ...formData,
      umpires: copy.length ? copy : [{ name: "", role: "on-field" }],
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full mb-6">
      <h2 className="text-lg font-semibold mb-4 dark:text-white">{title}</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Match Number"
            value={formData.matchNumber}
            onChange={(v) => setFormData({ ...formData, matchNumber: v })}
          />

          <Input
            label="Match Name"
            value={formData.matchName}
            onChange={(v) => setFormData({ ...formData, matchName: v })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Match Type"
            value={formData.matchType}
            onChange={(v) => setFormData({ ...formData, matchType: v })}
            options={[
              { value: "T20", label: "T20" },
              { value: "ODI", label: "ODI" },
              { value: "Test", label: "Test" },
            ]}
          />

          <Input
            label="Overs"
            type="number"
            value={formData.overs}
            onChange={(v) => setFormData({ ...formData, overs: Number(v) })}
          />
        </div>

        {/* TEAMS with logo preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Team A
            </label>
            <div className="flex items-center gap-3 mt-1">
              <select
                value={formData.teamA}
                onChange={(e) =>
                  setFormData({ ...formData, teamA: e.target.value })
                }
                className="block w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select team</option>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>

              {/* preview */}
              <img
                src={
                  teams.find((t) => t._id === formData.teamA)?.logo ||
                  "/default-team.png"
                }
                alt="team-a"
                className="h-10 w-10 rounded object-cover"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Team B
            </label>
            <div className="flex items-center gap-3 mt-1">
              <select
                value={formData.teamB}
                onChange={(e) =>
                  setFormData({ ...formData, teamB: e.target.value })
                }
                className="block w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="">Select team</option>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>

              {/* preview */}
              <img
                src={
                  teams.find((t) => t._id === formData.teamB)?.logo ||
                  "/default-team.png"
                }
                alt="team-b"
                className="h-10 w-10 rounded object-cover"
              />
            </div>
          </div>
        </div>

        {/* VENUE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Venue Name"
            value={formData.venue.name}
            onChange={(v) =>
              setFormData({
                ...formData,
                venue: { ...formData.venue, name: v },
              })
            }
          />

          <Input
            label="City"
            value={formData.venue.city}
            onChange={(v) =>
              setFormData({
                ...formData,
                venue: { ...formData.venue, city: v },
              })
            }
          />

          <Select
            label="Ground Type"
            value={formData.venue.groundType}
            onChange={(v) =>
              setFormData({
                ...formData,
                venue: { ...formData.venue, groundType: v },
              })
            }
            options={[
              { value: "Turf Pitch", label: "Turf Pitch" },
              { value: "Matting Pitch", label: "Matting Pitch" },
              { value: "Concrete Pitch", label: "Concrete Pitch" },
              { value: "Astro Pitch", label: "Astro Pitch" },
              { value: "Hybrid Pitch", label: "Hybrid Pitch" },
              {
                value: "International Stadium",
                label: "International Stadium",
              },
              { value: "Club Ground", label: "Club Groung" },
              {
                value: "School/College Ground",
                label: "School/College Ground",
              },
              { value: "Academy Ground", label: "Academy Ground" },
              { value: "Hybrid Pitch", label: "Hybrid Pitch" },
              { value: "Box Cricket Ground", label: "Box Cricket Ground" },
              {
                value: "Indoor Cricket Ground",
                label: "Indoor Cricket Ground",
              },
              { value: "Other", label: "Other" },
            ]}
          />
        </div>

        {/* Umpires (multi) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Umpires
          </label>

          <div className="space-y-2 mt-2">
            {(formData.umpires || []).map((ump, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Umpire name"
                  value={ump.name}
                  onChange={(e) => updateUmpire(idx, "name", e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  required
                />

                <select
                  value={ump.role}
                  onChange={(e) => updateUmpire(idx, "role", e.target.value)}
                  className="px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                >
                  <option value="on-field">On-field</option>
                  <option value="third-umpire">Third Umpire</option>
                </select>

                <button
                  type="button"
                  onClick={() => removeUmpire(idx)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addUmpire}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Umpire
            </button>
          </div>
        </div>

        <Select
          label="Assign Scorer"
          value={formData.scorerId}
          onChange={(v) => setFormData({ ...formData, scorerId: v })}
          options={scorers.map((s) => ({
            value: s._id,
            label: s.name,
          }))}
        />

        {/* BUTTONS */}
        <div className="flex space-x-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            {title.includes("Edit") ? "Update Match" : "Create Match"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  );
}

/* SELECT COMPONENT */
function Select({ label, value, onChange, options = [] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option value="">Select</option>
        {options.map((op, idx) => (
          <option key={idx} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ManageMatches;
