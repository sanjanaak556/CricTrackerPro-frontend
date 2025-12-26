import { useState, useEffect } from "react";

const WICKET_TYPES = [
  "Bowled",
  "Caught",
  "LBW",
  "Run Out",
  "Stumped",
  "Hit Wicket",
];

export default function PlayerSelectionModal({
  players = [],
  striker,
  nonStriker,
  onClose,
  onConfirm,
}) {
  const [wicketType, setWicketType] = useState("");
  const [newBatter, setNewBatter] = useState("");
  const [availableBatters, setAvailableBatters] = useState([]);

  // Safely calculate available batters
  useEffect(() => {
    if (!Array.isArray(players)) {
      setAvailableBatters([]);
      return;
    }

    // Ensure we have valid IDs for comparison
    const strikerId = striker?._id || striker;
    const nonStrikerId = nonStriker?._id || nonStriker;
    
    const filtered = players.filter((player) => {
      // Check if player has an _id property
      if (!player || !player._id) return false;
      
      // Get the player ID
      const playerId = player._id;
      
      // Exclude current batters
      return playerId !== strikerId && playerId !== nonStrikerId;
    });
    
    setAvailableBatters(filtered);
  }, [players, striker, nonStriker]);

  const isRunOut = wicketType === "Run Out";

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center px-2">
      <div className="bg-white dark:bg-gray-900 rounded w-full max-w-md p-5 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Wicket Details
        </h2>

        {/* WICKET TYPE */}
        <select
          className="w-full border rounded p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
          value={wicketType}
          onChange={(e) => setWicketType(e.target.value)}
        >
          <option value="">Select Wicket Type</option>
          {WICKET_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* NEW BATTER */}
        <select
          className="w-full border rounded p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
          value={newBatter}
          onChange={(e) => setNewBatter(e.target.value)}
          disabled={!wicketType || availableBatters.length === 0}
        >
          <option value="">
            {isRunOut
              ? "Select Incoming Batter (if striker out)"
              : "Select New Batter"}
          </option>

          {availableBatters.length > 0 ? (
            availableBatters.map((player) => (
              <option key={player._id} value={player._id}>
                {player.name || `Player ${player._id}`}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No available batters
            </option>
          )}
        </select>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            disabled={!wicketType || (!isRunOut && !newBatter)}
            onClick={() =>
              onConfirm({
                wicketType,
                newBatter: newBatter || null,
              })
            }
            className="px-4 py-2 rounded bg-red-600 text-white disabled:opacity-50"
          >
            Confirm Wicket
          </button>
        </div>
      </div>
    </div>
  );
}