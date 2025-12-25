import React, { useEffect, useState } from "react";
import api from "../../../services/api";

export default function ReportForm({ title, onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState({
    matchId: "",
    matchName: "",
    matchNumber: "",
    winnerTeamId: "",
    winType: "",
    winMargin: "",
    resultText: "",
    playerOfTheMatch: "",
    topScorer: "",
    bestBowler: "",
    ...(initialData || {}),
  });

  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [mRes, tRes, pRes] = await Promise.all([
          api.get("/matches"),
          api.get("/teams"),
          api.get("/players"),
        ]);

        setMatches(mRes?.data ?? []);
        setTeams(tRes?.data ?? []);
        setPlayers(pRes?.data ?? []);
      } catch (err) {
        console.error("Failed to fetch form data:", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm((f) => ({ ...f, ...initialData }));
    }
  }, [initialData]);

  const updateField = (key, value) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center px-4 z-50">
      <div className="absolute inset-0" onClick={onCancel} aria-hidden="true" />

      <form
        onSubmit={submit}
        className="relative max-w-3xl w-full bg-white dark:bg-gray-800 rounded-lg p-6 z-10 shadow-lg overflow-auto max-h-[90vh]"
      >
        <h3 className="text-lg font-semibold mb-4 dark:text-white">{title}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Match */}
          <label>
            <div className="text-sm text-gray-700 dark:text-gray-300">Match</div>
            <select
              value={form.matchId}
              onChange={(e) => {
                const mId = e.target.value;
                const selected = matches.find((m) => m._id === mId);
                updateField("matchId", mId);
                updateField("matchName", selected?.matchName ?? "");
                updateField("matchNumber", selected?.matchNumber ?? "");
              }}
              className="mt-1 block w-full px-3 py-2 rounded-md bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
            >
              <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select match</option>
              {matches.map((m) => (
                <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={m._id} value={m._id}>
                  {m.matchName} (#{m.matchNumber})
                </option>
              ))}
            </select>
          </label>

          {/* Winner */}
          <label>
            <div className="text-sm text-gray-700 dark:text-gray-300">Winner Team</div>
            <select
              value={form.winnerTeamId}
              onChange={(e) => updateField("winnerTeamId", e.target.value)}
              className="mt-1 block w-full px-3 py-2 rounded-md bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
            >
              <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select winner</option>
              {teams.map((t) => (
                <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>

          {/* Win Type */}
          <label>
            <div className="text-sm text-gray-700 dark:text-gray-300">Win Type</div>
            <select
              value={form.winType}
              onChange={(e) => updateField("winType", e.target.value)}
              className="mt-1 block w-full px-3 py-2 rounded-md bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
            >
              <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select</option>
              <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="runs">Runs</option>
              <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="wickets">Wickets</option>
              <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="superover">Super Over</option>
            </select>
          </label>

          {/* Win Margin */}
          <label>
            <div className="text-sm text-gray-700 dark:text-gray-300">Win Margin</div>
            <input
              type="number"
              value={form.winMargin}
              onChange={(e) => updateField("winMargin", e.target.value)}
              className="mt-1 block w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700"
            />
          </label>

          {/* Player of the Match */}
          <label className="md:col-span-2">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Player of the Match
            </div>
            <select
              value={form.playerOfTheMatch}
              onChange={(e) => updateField("playerOfTheMatch", e.target.value)}
              className="mt-1 block w-full px-3 py-2 rounded-md bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
            >
              <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select player</option>
              {players.map((p) => (
                <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {/* Top Scorer */}
          <label className="md:col-span-2">
            <div className="text-sm text-gray-700 dark:text-gray-300">Top Scorer</div>
            <select
              value={form.topScorer}
              onChange={(e) => updateField("topScorer", e.target.value)}
              className="mt-1 block w-full px-3 py-2 rounded-md bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
            >
              <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select player</option>
              {players.map((p) => (
                <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {/* Best Bowler */}
          <label className="md:col-span-2">
            <div className="text-sm text-gray-700 dark:text-gray-300">Best Bowler</div>
            <select
              value={form.bestBowler}
              onChange={(e) => updateField("bestBowler", e.target.value)}
              className="mt-1 block w-full px-3 py-2 rounded-md bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
            >
              <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select player</option>
              {players.map((p) => (
                <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          {/* Result Text */}
          <label className="md:col-span-2">
            <div className="text-sm text-gray-700 dark:text-gray-300">Result Text</div>
            <textarea
              value={form.resultText}
              onChange={(e) => updateField("resultText", e.target.value)}
              className="mt-1 block w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-700"
              rows={4}
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
          >
            Cancel
          </button>

          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
