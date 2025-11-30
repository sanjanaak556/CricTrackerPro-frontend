import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { setLiveScore } from "../../store/matchSlice";
import { socket } from "../../utils/socket";

export default function ScoreMatch() {
    const { matchId } = useParams();
    const dispatch = useDispatch();

    const [match, setMatch] = useState(null);
    const [inningsData, setInningsData] = useState(null);
    const [overId, setOverId] = useState(null);

    const [playersA, setPlayersA] = useState([]);
    const [playersB, setPlayersB] = useState([]);
    const [striker, setStriker] = useState("");
    const [nonStriker, setNonStriker] = useState("");
    const [bowler, setBowler] = useState("");

    const [lastOverBowler, setLastOverBowler] = useState("");
    const [needNewBowler, setNeedNewBowler] = useState(false);

    const [run, setRun] = useState(null);
    const [extra, setExtra] = useState(null);
    const [isWicket, setIsWicket] = useState(false);
    const [wicketType, setWicketType] = useState("");
    const [whichOut, setWhichOut] = useState("striker");

    const [comment, setComment] = useState("");

    const [showNewBatterModal, setShowNewBatterModal] = useState(false);
    const [selectedNewBatter, setSelectedNewBatter] = useState("");
    const [newBatterWhich, setNewBatterWhich] = useState("");
    const [pendingNewBatter, setPendingNewBatter] = useState(null);

    const [isBowlerBlocked, setIsBowlerBlocked] = useState(false);

    const EXTRA_MAP = {
        NB: "noball",
        WD: "wide",
        BYE: "bye",
        LB: "legbye",
    };

    // ----------------------------------------------------------
    // INITIAL LOAD
    // ----------------------------------------------------------
    useEffect(() => {
        loadMatch();
        fetchPlayers();
        fetchInnings();
        socket.emit("joinMatch", matchId);

        // --- LIVE SCORE SOCKET HANDLER ---
        const handleLiveScore = (data) => {
            dispatch(setLiveScore(data));
            if (inningsData && data.inningsId === inningsData._id) {
                setInningsData((prev) => ({
                    ...prev,
                    totalRuns: data.runs,
                    totalWickets: data.wickets,
                    totalOvers: data.overs,
                }));
            }
        };
        socket.on("liveScoreUpdate", handleLiveScore);

        // --- NEW BATTER NEEDED ---
        const handleNewBatter = (payload) => {
            setNewBatterWhich(payload.which || "striker");
            setSelectedNewBatter("");

            // Prevent auto closing
            setShowNewBatterModal(true);
        };
        socket.on("newBatterNeeded", handleNewBatter);

        // --- BOWLER NOT ALLOWED ALERT ---
        const handleBowlerNotAllowed = (payload) => {
            alert(payload.message || "Bowler cannot bowl this over.");

            // BLOCK scoring until user chooses new bowler
            setIsBowlerBlocked(true);

            // Clear invalid bowler
            setBowler("");

            // Open bowler selection modal
            setNeedNewBowler(true);
        };

        socket.on("bowlerNotAllowed", handleBowlerNotAllowed);

        // --- OVER COMPLETED ---
        const handleOverComplete = async () => {
            await fetchInnings();
            await fetchActiveOver();
        
            // Prevent scoring until bowler selected
            setIsBowlerBlocked(true);
        
            // Open bowler modal
            setNeedNewBowler(true);
        };
        
        socket.on("overComplete", handleOverComplete);

        // --- INNINGS COMPLETED ---
        const handleInningsComplete = () => {
            fetchInnings();
            fetchActiveOver();
            alert("Innings completed!");
        };
        socket.on("inningsComplete", handleInningsComplete);

        return () => {
            socket.off("liveScoreUpdate", handleLiveScore);
            socket.off("newBatterNeeded", handleNewBatter);
            socket.off("bowlerNotAllowed", handleBowlerNotAllowed);
            socket.off("overComplete", handleOverComplete);
            socket.off("inningsComplete", handleInningsComplete);
        };
    }, [matchId, inningsData]);

    useEffect(() => {
        if (inningsData?._id) fetchActiveOver();
    }, [inningsData]);

    // ----------------------------------------------------------
    // API CALLS
    // ----------------------------------------------------------
    async function loadMatch() {
        try {
            const res = await api.get(`/matches/${matchId}`);
            setMatch(res);
        } catch (err) {
            console.log("Match load error:", err);
        }
    }

    async function fetchPlayers() {
        try {
            const res = await api.get(`/matches/${matchId}/players`);
            setPlayersA(res.playersA || []);
            setPlayersB(res.playersB || []);
        } catch (err) {
            console.log("Players load error:", err);
        }
    }

    async function fetchInnings() {
        try {
            const res = await api.get(`/innings/match/${matchId}`);
            setInningsData(res.innings);
            setPendingNewBatter(null);
        } catch (err) {
            console.log("Innings load error:", err);
        }
    }

    async function fetchActiveOver() {
        try {
            const res = await api.get(`/overs/active/${inningsData._id}`);
            if (res.activeOver) {
                setOverId(res.activeOver._id);
                setLastOverBowler(res.activeOver.bowler || "");
            } else {
                setOverId(null);
            }
        } catch (err) {
            console.log("Active over load error:", err);
        }
    }

    async function startFirstOver() {
        if (!bowler) {
            alert("Select a bowler to begin the over.");
            return false;
        }

        if (bowler === lastOverBowler) {
            alert("This bowler cannot bowl consecutive overs.");
            return false;
        }

        try {
            const res = await api.post("/overs/start", {
                inningsId: inningsData._id,
                bowler,
            });

            setOverId(res.over._id);
            setNeedNewBowler(false);
            setIsBowlerBlocked(false); // ✔ allow scoring again
        } catch (err) {
            console.log("Start over error:", err);
        }
    }


    // ----------------------------------------------------------
    // NEW BATTER CONFIRMATION
    // ----------------------------------------------------------
    function confirmNewBatter() {
        if (!selectedNewBatter) {
            alert("Select a batter.");
            return;
        }

        if (newBatterWhich === "striker") setStriker(selectedNewBatter);
        else setNonStriker(selectedNewBatter);

        setPendingNewBatter({
            which: newBatterWhich,
            playerId: selectedNewBatter,
        });

        setShowNewBatterModal(false);
    }

    // ----------------------------------------------------------
    // SUBMIT BALL
    // ----------------------------------------------------------
    async function submitBall() {
        if (isBowlerBlocked) {
            alert("Bowler not allowed. Please choose a valid bowler first.");
            return;
        }

        if (!overId) {
            alert("Start the over first.");
            return;
        }

        if (!striker || !nonStriker || !bowler) {
            alert("Select striker, non-striker & bowler.");
            return;
        }

        if (run === null && !extra && !isWicket) {
            alert("Select run OR extra OR wicket.");
            return;
        }

        if (isWicket && !wicketType) {
            alert("Select wicket type!");
            return;
        }

        if (isWicket && wicketType === "runout" && !whichOut) {
            alert("Select which batter was out!");
            return;
        }

        const payload = {
            matchId,
            inningsId: inningsData._id,
            overId,
            striker,
            nonStriker,
            bowler,
            runs: run || 0,
            extraType: extra ? EXTRA_MAP[extra] : "none",
            isWicket,
            wicketType: isWicket ? wicketType : null,
            dismissal: isWicket
                ? wicketType === "runout"
                    ? { type: "runout", out: whichOut }
                    : { type: wicketType, out: "striker" }
                : null,
            comment,
            newBatter: pendingNewBatter ?? null,
        };

        try {
            await api.post("/balls", payload);

            setRun(null);
            setExtra(null);
            setIsWicket(false);
            setWicketType("");
            setWhichOut("striker");
            setComment("");
            setPendingNewBatter(null);

            fetchInnings();
            fetchActiveOver();
        } catch (err) {
            console.log("Ball submit error:", err);
        }
    }

    // ----------------------------------------------------------
    // UI SETUP
    // ----------------------------------------------------------
    if (!match || !inningsData) return <div className="p-6">Loading match…</div>;

    const battingPlayers =
        String(inningsData.battingTeam) === String(match.teamA._id || match.teamA)
            ? playersA
            : playersB;

    const bowlingPlayers =
        String(inningsData.bowlingTeam) === String(match.teamA._id || match.teamA)
            ? playersA
            : playersB;

    return (
        <div className="p-6 max-w-4xl mx-auto">

            <h1 className="text-2xl font-bold mb-3">Scoring Panel — {match.matchName}</h1>

            {/* Pending new batter badge */}
            {pendingNewBatter && (
                <div className="mb-4 bg-yellow-200 px-4 py-2 rounded border border-yellow-400 text-sm">
                    <strong>Pending new batter:</strong>{" "}
                    {battingPlayers.find((p) => p._id === pendingNewBatter.playerId)?.name} — will enter next ball.
                </div>
            )}

            {/* Match stats */}
            <div className="mb-4 text-gray-700">
                <div>Innings: {inningsData.inningsNumber}</div>
                <div>Score: {inningsData.totalRuns} / {inningsData.totalWickets}</div>
                <div>Overs: {inningsData.totalOvers}</div>
            </div>

            {/* Start new over button */}
            <button
                onClick={startFirstOver}
                className="px-4 py-2 bg-purple-600 text-white rounded mb-4"
            >
                Start Over
      </button>

            {/* Player selectors */}
            <div className="bg-white p-4 rounded shadow mb-6">
                {/* STRIKER */}
                <label className="font-semibold">Striker (Batter)</label>
                <select
                    value={striker}
                    onChange={(e) => setStriker(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                >
                    <option value="">Select Striker</option>
                    {battingPlayers.map((p) => (
                        <option key={p._id} value={p._id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                {/* NON STRIKER */}
                <label className="font-semibold">Non-Striker (Batter)</label>
                <select
                    value={nonStriker}
                    onChange={(e) => setNonStriker(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                >
                    <option value="">Select Non-Striker</option>
                    {battingPlayers.map((p) => (
                        <option key={p._id} value={p._id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                {/* BOWLER */}
                <label className="font-semibold">Bowler</label>
                <select
                    value={bowler}
                    onChange={(e) => {
                        const selected = e.target.value;
                        if (selected === lastOverBowler) {
                            alert("This bowler cannot bowl consecutive overs.");
                            return;
                        }
                        setBowler(selected);
                    }}
                    className="border p-2 rounded w-full"
                >
                    <option value="">Select Bowler</option>
                    {bowlingPlayers.map((p) => (
                        <option
                            key={p._id}
                            value={p._id}
                            disabled={p._id === lastOverBowler}
                        >
                            {p.name} {p._id === lastOverBowler ? "(bowled last over)" : ""}
                        </option>
                    ))}
                </select>
            </div>

            {/* RUNS */}
            <h2 className="font-semibold mt-2">Runs</h2>
            <div className="flex gap-2 mt-2">
                {[0, 1, 2, 3, 4, 6].map((r) => (
                    <button
                        key={r}
                        onClick={() => setRun(r)}
                        className={`px-4 py-2 rounded border ${run === r ? "bg-blue-500 text-white" : ""}`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            {/* EXTRAS */}
            <h2 className="font-semibold mt-4">Extras</h2>
            <div className="flex gap-2 mt-2">
                {["NB", "WD", "BYE", "LB"].map((ext) => (
                    <button
                        key={ext}
                        onClick={() => setExtra(ext)}
                        className={`px-4 py-2 rounded border ${
                            extra === ext ? "bg-yellow-400" : ""
                            }`}
                    >
                        {ext}
                    </button>
                ))}
            </div>

            {/* WICKET */}
            <h2 className="font-semibold mt-4">Wicket</h2>
            <div className="flex gap-2 items-center mt-2">
                <button
                    onClick={() => setIsWicket(!isWicket)}
                    className={`px-4 py-2 rounded border ${isWicket ? "bg-red-600 text-white" : ""}`}
                >
                    OUT
        </button>

                {isWicket && (
                    <>
                        <select
                            value={wicketType}
                            onChange={(e) => setWicketType(e.target.value)}
                            className="border p-2 rounded"
                        >
                            <option value="">Select Wicket Type</option>
                            <option value="bowled">Bowled</option>
                            <option value="caught">Caught</option>
                            <option value="lbw">LBW</option>
                            <option value="runout">Run Out</option>
                            <option value="stumped">Stumped</option>
                            <option value="hitwicket">Hit Wicket</option>
                        </select>

                        {wicketType === "runout" && (
                            <select
                                value={whichOut}
                                onChange={(e) => setWhichOut(e.target.value)}
                                className="border p-2 rounded ml-2"
                            >
                                <option value="striker">Striker Out</option>
                                <option value="nonStriker">Non-Striker Out</option>
                            </select>
                        )}
                    </>
                )}
            </div>

            {/* COMMENTARY */}
            <h2 className="font-semibold mt-4">Commentary</h2>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                placeholder="Optional ball commentary"
            />

            {/* SUBMIT BALL */}
            <button
                onClick={submitBall}
                disabled={isBowlerBlocked}
                className={`px-6 py-3 text-white rounded 
        ${isBowlerBlocked ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"}`}
            >
                Submit Ball
</button>


            {/* --------------------------------------------------------
          MODAL: NEW BATTER
      ---------------------------------------------------------*/}
            {showNewBatterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-md w-full text-center">
                        <h3 className="text-lg font-semibold mb-3">New Batter Required</h3>
                        <p className="mb-3">
                            Select the incoming{" "}
                            <strong>{newBatterWhich === "striker" ? "striker" : "non-striker"}</strong>.
            </p>

                        <select
                            value={selectedNewBatter}
                            onChange={(e) => setSelectedNewBatter(e.target.value)}
                            className="border p-2 rounded w-full mb-4"
                        >
                            <option value="">Select Batter</option>
                            {battingPlayers.map((p) => (
                                <option key={p._id} value={p._id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={confirmNewBatter}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Confirm Batter
            </button>
                    </div>
                </div>
            )}

            {/* --------------------------------------------------------
          MODAL: NEW BOWLER AFTER OVER COMPLETES
      ---------------------------------------------------------*/}
            {needNewBowler && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-md w-full text-center">
                        <h3 className="text-lg font-semibold mb-3">Select Next Over’s Bowler</h3>

                        <select
                            value={bowler}
                            onChange={(e) => {
                                const selected = e.target.value;
                                if (selected === lastOverBowler) {
                                    alert("This bowler cannot bowl consecutive overs.");
                                    return;
                                }
                                setBowler(selected);
                            }}
                            className="border p-2 rounded w-full mb-4"
                        >
                            <option value="">Select Bowler</option>
                            {bowlingPlayers.map((p) => (
                                <option
                                    key={p._id}
                                    value={p._id}
                                    disabled={p._id === lastOverBowler}
                                >
                                    {p.name} {p._id === lastOverBowler ? "(bowled last over)" : ""}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={async () => {
                                if (!bowler) {
                                    alert("Select a bowler.");
                                    return;
                                }

                                await startFirstOver();
                                setNeedNewBowler(false);
                                setIsBowlerBlocked(false);
                            }}
                            className="px-4 py-2 bg-purple-600 text-white rounded"
                        >
                            Confirm Bowler
            </button>
                    </div>
                </div>
            )}
        </div>
    );
}
