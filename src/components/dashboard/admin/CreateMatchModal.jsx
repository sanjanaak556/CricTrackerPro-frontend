import React, { useState } from "react";
import { X } from "lucide-react";

function CreateMatchModal({ isOpen, onClose, onSubmit, teams, scorers }) {
  const [formData, setFormData] = useState({
    matchNumber: "",
    matchName: "",
    matchType: "T20",
    teamA: "",
    teamB: "",
    overs: 20,
    scheduledAt: new Date().toISOString(),
    venue: { name: "", city: "", groundType: "" },
    umpires: [{ name: "", role: "on-field" }],
    scorerId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Sending match data:", formData);
      await onSubmit(formData);
      // Reset form on success
      setFormData({
        matchNumber: "",
        matchName: "",
        matchType: "T20",
        teamA: "",
        teamB: "",
        overs: 20,
        scheduledAt: new Date().toISOString(),
        venue: { name: "", city: "", groundType: "" },
        umpires: [{ name: "", role: "on-field" }],
        scorerId: "",
      });
    } catch (err) {
      console.error("Create match error details:", err.response?.data);
      setError(err.message || "Failed to create match");
    } finally {
      setLoading(false);
    }
  };

  const updateUmpire = (idx, key, value) => {
    const copy = [...formData.umpires];
    copy[idx] = { ...copy[idx], [key]: value };
    setFormData({ ...formData, umpires: copy });
  };

  const addUmpire = () => {
    setFormData({
      ...formData,
      umpires: [...formData.umpires, { name: "", role: "on-field" }],
    });
  };

  const removeUmpire = (idx) => {
    const copy = [...formData.umpires];
    copy.splice(idx, 1);
    setFormData({
      ...formData,
      umpires: copy.length ? copy : [{ name: "", role: "on-field" }],
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Create New Match</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields same as before */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Match Number"
                value={formData.matchNumber}
                onChange={(v) => setFormData({ ...formData, matchNumber: v })}
              />

              <InputField
                label="Match Name"
                value={formData.matchName}
                onChange={(v) => setFormData({ ...formData, matchName: v })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Match Type"
                value={formData.matchType}
                onChange={(v) => setFormData({ ...formData, matchType: v })}
                options={[
                  { value: "T20", label: "T20" },
                  { value: "ODI", label: "ODI" },
                  { value: "TEST", label: "Test" },
                  { value: "OTHER", label: "Other" }
                ]}
              />

              <InputField
                label="Overs"
                type="number"
                value={formData.overs}
                onChange={(v) => setFormData({ ...formData, overs: Number(v) })}
              />
            </div>

            {/* Scheduled Date and time */}
            <InputField
              label="Scheduled Date & Time"
              type="datetime-local"
              value={formData.scheduledAt ? new Date(formData.scheduledAt).toISOString().slice(0, 16) : ""}
              onChange={(v) => {
                // Create date in local time, then convert to ISO string
                const date = new Date(v);
                // Add timezone offset to get correct UTC time
                const isoString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
                setFormData({ ...formData, scheduledAt: isoString });
              }}
            />

            {/* TEAMS with logo preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <TeamSelect
                label="Team A"
                value={formData.teamA}
                onChange={(v) => setFormData({ ...formData, teamA: v })}
                teams={teams}
              />

              <TeamSelect
                label="Team B"
                value={formData.teamB}
                onChange={(v) => setFormData({ ...formData, teamB: v })}
                teams={teams}
              />
            </div>

            {/* VENUE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField
                label="Venue Name"
                value={formData.venue.name}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    venue: { ...formData.venue, name: v },
                  })
                }
              />

              <InputField
                label="City"
                value={formData.venue.city}
                onChange={(v) =>
                  setFormData({
                    ...formData,
                    venue: { ...formData.venue, city: v },
                  })
                }
              />

              <SelectField
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
                  { value: "International Stadium", label: "International Stadium" },
                  { value: "Club Ground", label: "Club Ground" },
                  { value: "School/College Ground", label: "School/College Ground" },
                  { value: "Academy Ground", label: "Academy Ground" },
                  { value: "Box Cricket Ground", label: "Box Cricket Ground" },
                  { value: "Indoor Cricket Ground", label: "Indoor Cricket Ground" },
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
                {formData.umpires.map((ump, idx) => (
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
                      className="px-3 py-2 rounded-md bg-base-100 dark:bg-base-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                    >
                      <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="on-field">On-field</option>
                      <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="third-umpire">Third Umpire</option>
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

            <SelectField
              label="Assign Scorer"
              value={formData.scorerId}
              onChange={(v) => setFormData({ ...formData, scorerId: v })}
              options={scorers.map((s) => ({
                value: s._id,
                label: s.name,
              }))}
            />

            {/* BUTTONS */}
            <div className="flex space-x-2 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Match"}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper components
function InputField({ label, value, onChange, type = "text" }) {
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

function SelectField({ label, value, onChange, options = [] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full px-3 py-2 rounded-md bg-base-100 dark:bg-base-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select</option>
        {options.map((op, idx) => (
          <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={idx} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TeamSelect({ label, value, onChange, teams }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="flex items-center gap-3 mt-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full px-3 py-2 rounded-md bg-base-100 dark:bg-base-200 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
          required
        >
          <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select team</option>
          {Array.isArray(teams) && teams.map((t) => (
            <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* preview */}
        <img
          src={
            Array.isArray(teams) && teams.find((t) => t._id === value)?.logo ||
            "/default-team.png"
          }
          alt="team"
          className="h-10 w-10 rounded object-cover"
        />
      </div>
    </div>
  );
}

export default CreateMatchModal;