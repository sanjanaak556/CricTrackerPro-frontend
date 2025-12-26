// components/dashboard/scorer/StartInningsModal.jsx
import { useState } from "react";

export default function StartInningsModal({
  players = [],
  onClose,
  onConfirm,
}) {
  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");

  // Filter available players for selection
  const availablePlayers = Array.isArray(players) ? players : [];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-2">
      <div className="bg-white dark:bg-gray-900 rounded w-full max-w-md p-5 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Start Innings - Select Opening Batters
        </h2>

        {/* STRIKER */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Striker (Facing)
          </label>
          <select
            className="w-full border rounded p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
            value={striker}
            onChange={(e) => setStriker(e.target.value)}
          >
            <option value="">Select Striker</option>
            {availablePlayers.map((player) => (
              <option key={player._id} value={player._id}>
                {player.name}
              </option>
            ))}
          </select>
        </div>

        {/* NON-STRIKER */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Non-Striker
          </label>
          <select
            className="w-full border rounded p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
            value={nonStriker}
            onChange={(e) => setNonStriker(e.target.value)}
            disabled={!striker}
          >
            <option value="">Select Non-Striker</option>
            {availablePlayers
              .filter((player) => player._id !== striker)
              .map((player) => (
                <option key={player._id} value={player._id}>
                  {player.name}
                </option>
              ))}
          </select>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            disabled={!striker || !nonStriker}
            onClick={() => onConfirm({
              striker,
              nonStriker
            })}
            className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-50"
          >
            Start Innings
          </button>
        </div>
      </div>
    </div>
  );
}