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
  fieldingPlayers = [],
  striker,
  nonStriker,
  onClose,
  onConfirm,
}) {
  const [wicketType, setWicketType] = useState("");
  const [newBatter, setNewBatter] = useState("");
  const [fielder, setFielder] = useState("");
  const [whoIsOut, setWhoIsOut] = useState("");
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
  const requiresFielder = ["Caught", "Stumped", "Run Out"].includes(wicketType);

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

        {/* FIELDER - only for caught, stumped, runout */}
        {requiresFielder && (
          <select
            className="w-full border rounded p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
            value={fielder}
            onChange={(e) => setFielder(e.target.value)}
          >
            <option value="">Select Fielder</option>
            {fieldingPlayers.length > 0 ? (
              fieldingPlayers.map((player) => (
                <option key={player._id} value={player._id}>
                  {player.name || `Player ${player._id}`}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No fielding players available
              </option>
            )}
          </select>
        )}

        {/* WHO IS OUT - only for runout */}
        {isRunOut && (
          <select
            className="w-full border rounded p-2 bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white"
            value={whoIsOut}
            onChange={(e) => setWhoIsOut(e.target.value)}
          >
            <option value="">Who is out?</option>
            <option value="striker">Striker</option>
            <option value="nonStriker">Non-Striker</option>
          </select>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            disabled={!wicketType || (!isRunOut && !newBatter) || (requiresFielder && !fielder) || (isRunOut && !whoIsOut)}
            onClick={() =>
              onConfirm({
                wicketType,
                newBatter: newBatter || null,
                fielder: fielder || null,
                whoIsOut: whoIsOut || null,
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