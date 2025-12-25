import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import TossWinnerModal from "../../components/dashboard/scorer/TossWinnerModal";

export default function StartScoring() {
  const { matchId } = useParams();
  const navigate = useNavigate();

  const [match, setMatch] = useState(null);
  const [playersA, setPlayersA] = useState([]);
  const [playersB, setPlayersB] = useState([]);
  const [showTossModal, setShowTossModal] = useState(false);
  const [creatingInnings, setCreatingInnings] = useState(false);
  const [innings, setInnings] = useState(null);

  // selectors for starting innings
  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [bowler, setBowler] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!matchId) return;
    loadMatch();
    loadPlayers();
  }, [matchId]);

  async function loadMatch() {
    try {
      const res = await api.get(`/matches/${matchId}`);
      setMatch(res);
      // if match already live, navigate to scoring panel
      if (res.status === "live") {
        navigate(`/scorer/score/${matchId}`);
      } else {
        setShowTossModal(true);
      }
    } catch (err) {
      console.error("Failed to load match", err);
    }
  }

  async function loadPlayers() {
    try {
      const res = await api.get(`/matches/${matchId}/players`);
      setPlayersA(res.teamA?.players || []);
      setPlayersB(res.teamB?.players || []);
    } catch (err) {
      console.error("Failed to load players", err);
    }
  }

  // Called after toss submission — create first innings
  const handleTossSuccess = async (tossData) => {
    try {
      setShowTossModal(false);

      // Determine batting/bowling team based on electedTo
      const tossWinner = tossData.tossWinner;
      const electedTo = tossData.electedTo; // 'bat' or 'bowl'

      const teamAId = match.teamA._id || match.teamA;
      const teamBId = match.teamB._id || match.teamB;

      let battingTeam = null;
      let bowlingTeam = null;

      if (electedTo === "bat") {
        battingTeam = tossWinner;
        bowlingTeam = tossWinner === teamAId ? teamBId : teamAId;
      } else {
        // elected to bowl -> opponent bats
        bowlingTeam = tossWinner;
        battingTeam = tossWinner === teamAId ? teamBId : teamAId;
      }

      setCreatingInnings(true);

      // Create innings 1
      const createRes = await api.post("/innings", {
        matchId,
        battingTeam,
        bowlingTeam,
        inningsNumber: 1,
      });

      setInnings(createRes.innings);

      // Now prompt for striker/non-striker/bowler selection
    } catch (err) {
      console.error("Failed creating innings", err);
      setValidationError(err.response?.data?.message || err.message || "Failed to create innings");
    } finally {
      setCreatingInnings(false);
    }
  };

  const validateAndStartInnings = async () => {
    setValidationError("");
    if (!innings) {
      setValidationError("Innings not created yet");
      return;
    }

    // Basic validations
    if (!striker || !nonStriker) {
      setValidationError("Select striker and non-striker");
      return;
    }
    if (striker === nonStriker) {
      setValidationError("Striker and non-striker cannot be same");
      return;
    }
    if (!bowler) {
      setValidationError("Select a bowler");
      return;
    }

    // Ensure selected players belong to correct teams
    const battingPlayers = String(innings.battingTeam) === String(match.teamA._id || match.teamA) ? playersA : playersB;
    const bowlingPlayers = String(innings.bowlingTeam) === String(match.teamA._id || match.teamA) ? playersA : playersB;

    const strikerValid = battingPlayers.some((p) => p._id === striker);
    const nonStrikerValid = battingPlayers.some((p) => p._id === nonStriker);
    const bowlerValid = bowlingPlayers.some((p) => p._id === bowler);

    if (!strikerValid || !nonStrikerValid) {
      setValidationError("Selected batters must belong to batting team");
      return;
    }
    if (!bowlerValid) {
      setValidationError("Selected bowler must belong to bowling team");
      return;
    }

    try {
      await api.post(`/innings/start/${innings._id}`, {
        striker,
        nonStriker,
        currentBowler: bowler,
      });

      // Navigate to scoring panel
      navigate(`/scorer/score/${matchId}`);
    } catch (err) {
      console.error("Failed to start innings", err);
      setValidationError(err.response?.data?.message || err.message || "Failed to start innings");
    }
  };

  // UI
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Start Match — Scoring Setup</h1>

      {!match && <div>Loading match...</div>}

      {match && (
        <div className="space-y-4">
          <div className="bg-base-100 p-4 rounded shadow">
            <div className="font-semibold">{match.matchName}</div>
            <div className="text-sm text-gray-600">{match.teamA.name} vs {match.teamB.name}</div>
            <div className="text-sm text-gray-600">Overs: {match.overs}</div>
            <div className="text-sm text-gray-600">Status: {match.status}</div>
          </div>

          {/* Toss Modal toggled automatically */}
          {showTossModal && (
            <TossWinnerModal
              matchId={matchId}
              teamA={match.teamA}
              teamB={match.teamB}
              onClose={() => setShowTossModal(false)}
              onSuccess={async (updateData) => {
                // call start endpoint (scorer)
                try {
                  await api.put(`/matches/${matchId}/start`, {
                    tossWinner: updateData.tossWinner,
                    electedTo: updateData.electedTo,
                  });
                  handleTossSuccess(updateData);
                } catch (err) {
                  console.error("Start match API failed", err);
                }
              }}
            />
          )}

          {creatingInnings && <div>Creating innings...</div>}

          {innings && (
            <div className="bg-base-100 p-4 rounded shadow space-y-3">
              <div className="font-semibold">Select Opening Players</div>

              <label className="block">
                <div className="text-sm">Striker</div>
                <select value={striker} onChange={(e) => setStriker(e.target.value)} className="mt-1 w-full p-2 border rounded bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white">
                  <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select striker</option>
                  {(String(innings.battingTeam) === String(match.teamA._id || match.teamA) ? playersA : playersB).map((p) => (
                    <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={p._id} value={p._id}>{p.name} {p.isCaptain ? "(C)" : ""}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className="text-sm">Non-Striker</div>
                <select value={nonStriker} onChange={(e) => setNonStriker(e.target.value)} className="mt-1 w-full p-2 border rounded bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white">
                  <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select non-striker</option>
                  {(String(innings.battingTeam) === String(match.teamA._id || match.teamA) ? playersA : playersB).map((p) => (
                    <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <div className="text-sm">Bowler</div>
                <select value={bowler} onChange={(e) => setBowler(e.target.value)} className="mt-1 w-full p-2 border rounded bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white">
                  <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select bowler</option>
                  {(String(innings.bowlingTeam) === String(match.teamA._id || match.teamA) ? playersA : playersB).map((p) => (
                    <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={p._id} value={p._p?._id ?? p._id}>{p.name}</option>
                  ))}
                </select>
              </label>

              {validationError && (
                <div className="text-sm text-red-600">{validationError}</div>
              )}

              <div className="flex gap-2">
                <button onClick={validateAndStartInnings} className="px-4 py-2 bg-green-600 text-white rounded">Start Innings</button>
                <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
