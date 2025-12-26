import { useState } from "react";

export default function BowlerSelectionModal({
  bowlers = [],
  onConfirm,
  onClose,
}) {
  const [selectedBowler, setSelectedBowler] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-2">
      <div className="bg-white dark:bg-gray-900 rounded w-full max-w-md p-5 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Select Bowler
        </h2>

        <select
          value={selectedBowler}
          onChange={(e) => setSelectedBowler(e.target.value)}
          className="w-full border rounded p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
        >
          <option value="">Select Bowler</option>
          {bowlers.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            disabled={!selectedBowler}
            onClick={() => onConfirm(selectedBowler)}
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
