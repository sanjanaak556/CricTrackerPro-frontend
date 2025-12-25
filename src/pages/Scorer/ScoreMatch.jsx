import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { useDispatch } from "react-redux";
import { updateLiveScore } from "../../store/matchSlice";
import { socket } from "../../utils/socket";

export default function ScoreMatch() {
    const { matchId } = useParams();
    const dispatch = useDispatch();

    const [match, setMatch] = useState(null);
    const [inningsData, setInningsData] = useState(null);
    const [overId, setOverId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [playersA, setPlayersA] = useState([]);
    const [playersB, setPlayersB] = useState([]);
    const [striker, setStriker] = useState("");
    const [nonStriker, setNonStriker] = useState("");
    const [bowler, setBowler] = useState("");

    const [lastOverBowler, setLastOverBowler] = useState("");
    const [activeOverLegalBalls, setActiveOverLegalBalls] = useState(0);
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
        setLoading(true);
        setError("");

        Promise.allSettled([loadMatch(), fetchPlayers(), fetchInnings()])
            .then((results) => {
                const rejected = results.find((r) => r.status === "rejected");
                if (rejected) {
                    console.error("One or more initial requests failed", results);
                    setError("Failed to load match data. Check console for details.");
                }
            })
            .finally(() => setLoading(false));

        socket.emit("joinMatch", matchId);

        // --- LIVE SCORE SOCKET HANDLER ---
        const handleLiveScore = (data) => {
            dispatch(updateLiveScore(data));
            setInningsData((prev) => {
                if (prev && data.inningsId === prev._id) {
                    return {
                        ...prev,
                        totalRuns: data.runs,
                        totalWickets: data.wickets,
                        totalOvers: data.overs,
                    };
                }
                return prev;
            });
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

        // --- CHOOSE BOWLER (server requests new bowler explicitly) ---
        const handleChooseBowler = (payload) => {
            alert(payload?.message || "Select a bowler to start the next over.");
            setIsBowlerBlocked(true);
            setNeedNewBowler(true);
        };

        socket.on("chooseBowler", handleChooseBowler);

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
            socket.off("chooseBowler");
            socket.off("inningsComplete", handleInningsComplete);
        };
    }, [matchId]);

    // When innings changes, fetch active over and set initial players
    useEffect(() => {
        if (inningsData?._id) {
            fetchActiveOver();

            // If innings already had opening players, set them and lock selectors
            if (inningsData.striker) setStriker(inningsData.striker);
            if (inningsData.nonStriker) setNonStriker(inningsData.nonStriker);
            if (inningsData.currentBowler) setBowler(inningsData.currentBowler);
        }
    }, [inningsData]);

    // ----------------------------------------------------------
    // API CALLS
    // ----------------------------------------------------------
    async function loadMatch() {
        try {
            const res = await api.get(`/matches/${matchId}`);
            setMatch(res);
            return res;
        } catch (err) {
            console.error("Match load error:", err);
            setError((e) => e || (err.response?.data?.message ?? err.message ?? "Failed to load match"));
            throw err;
        }
    }

    async function fetchPlayers() {
        try {
            const res = await api.get(`/matches/${matchId}/players`);
            // handle multiple possible response shapes
            if (res.teamA || res.teamB) {
                setPlayersA(res.teamA?.players || []);
                setPlayersB(res.teamB?.players || []);
            } else if (res.playersA || res.playersB) {
                setPlayersA(res.playersA || []);
                setPlayersB(res.playersB || []);
            } else {
                setPlayersA(res.teamA?.players || []);
                setPlayersB(res.teamB?.players || []);
            }
            return res;
        } catch (err) {
            console.error("Players load error:", err);
            setError((e) => e || (err.response?.data?.message ?? err.message ?? "Failed to load players"));
            throw err;
        }
    }

    async function fetchInnings() {
        try {
            const res = await api.get(`/innings/match/${matchId}`);

            // backend returns an array of innings; frontend sometimes expects an object
            let inningsArray = [];
            if (Array.isArray(res)) inningsArray = res;
            else if (Array.isArray(res.innings)) inningsArray = res.innings;
            else if (Array.isArray(res.data)) inningsArray = res.data;

            const active = inningsArray.find((i) => i.isActive) || inningsArray[0] || null;
            setInningsData(active);
            setPendingNewBatter(null);
            return res;
        } catch (err) {
            console.error("Innings load error:", err);
            setError((e) => e || (err.response?.data?.message ?? err.message ?? "Failed to load innings"));
            throw err;
        }
    }

    async function fetchActiveOver() {
        try {
            const res = await api.get(`/overs/active/${inningsData._id}`);
            if (res.activeOver) {
                setOverId(res.activeOver._id);
                setLastOverBowler(res.activeOver.bowler?._id || res.activeOver.bowler || "");

                // prefer server-reported legalBalls if present
                if (typeof res.legalBalls === "number") {
                    setActiveOverLegalBalls(res.legalBalls);
                } else if (Array.isArray(res.activeOver.balls)) {
                    const legalCount = res.activeOver.balls.filter(b => b.isLegalDelivery).length;
                    setActiveOverLegalBalls(legalCount);
                } else {
                    setActiveOverLegalBalls(0);
                }

                // if there is an active over and a bowler already set, we don't need a new one
                setNeedNewBowler(!res.activeOver.bowler);
            } else {
                setOverId(null);
                setActiveOverLegalBalls(0);
                setNeedNewBowler(true);
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

            // fetch active over balls
            await fetchActiveOver();
        } catch (err) {
            console.log("Start over error:", err);
            const msg = err?.response?.data?.error || err?.message || "Failed to start over";
            alert(msg);
            // If server says consecutive or active over, ensure UI prompts for correct action
            if (msg.includes("consecutive") || msg.includes("active") || msg.includes("Choose a different bowler")) {
                setNeedNewBowler(true);
                setIsBowlerBlocked(true);
            }
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

        const isLegalDelivery = !(EXTRA_MAP[extra] === "wide" || EXTRA_MAP[extra] === "noball");

        // Re-check legal ball count to prevent submitting more than 6 legal balls in an over
        if (isLegalDelivery && activeOverLegalBalls >= 6) {
            alert("This over already has 6 legal deliveries. Please start the next over and select a new bowler.");
            setNeedNewBowler(true);
            setIsBowlerBlocked(true);
            return;
        }

        if (!striker || !nonStriker || !bowler) {
            alert("Select striker, non-striker & bowler.");
            return;
        }

        if (striker === nonStriker) {
            alert("Striker and non-striker cannot be the same player.");
            return;
        }

        if (bowler === striker || bowler === nonStriker) {
            alert("Bowler cannot be one of the batting players on the field.");
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
            const msg = err?.response?.data?.error || err?.message;
            if (msg) alert(msg);

            // If server-side validation indicates over is full or bowler invalid, update UI
            if (msg && (msg.includes("6 legal") || msg.includes("over still active") || msg.includes("consecutive") || msg.includes("does not match"))) {
                await fetchActiveOver();
                setNeedNewBowler(true);
                setIsBowlerBlocked(true);
            }
        }
    }

    // ----------------------------------------------------------
    // UI SETUP
    // ----------------------------------------------------------
    if (loading) return <div className="p-6">Loading match…</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;
    if (!match || !inningsData) return <div className="p-6">No match data available.</div>;

    const battingPlayers =
        String(inningsData.battingTeam) === String(match.teamA._id || match.teamA)
            ? playersA
            : playersB;

    const bowlingPlayers =
        String(inningsData.bowlingTeam) === String(match.teamA._id || match.teamA)
            ? playersA
            : playersB;

    return (
        <div className="p-6 max-w-6xl mx-auto">

            {/* ---------- Header: Teams & Score ---------- */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow mb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3">
                        <img src={match.teamA?.logo || '/default-team.png'} alt={match.teamA?.name} className="w-12 h-12 rounded-full" />
                        <div>
                            <div className="text-lg font-semibold">{match.teamA?.name} <span className="text-sm text-gray-500">vs</span> {match.teamB?.name}</div>
                            <div className="text-sm text-gray-400">{match.matchType} • {match.overs} overs • {match.venue?.name}</div>
                        </div>
                        <img src={match.teamB?.logo || '/default-team.png'} alt={match.teamB?.name} className="w-12 h-12 rounded-full" />
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-sm text-gray-500">Current Score</div>
                    <div className="text-2xl font-bold text-green-700">{match.currentScore?.runs ?? 0}/{match.currentScore?.wickets ?? 0}</div>
                    <div className="text-sm text-gray-500">Overs: {match.currentScore?.overs ?? '0.0'}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                <div className="lg:col-span-2">
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
                    <div className="bg-base-100 dark:bg-base-200 p-4 rounded shadow mb-6">
                {/* STRIKER */}
                <label className="font-semibold">Striker (Batter)</label>
                <select
                    value={striker}
                    onChange={(e) => setStriker(e.target.value)}
                    disabled={inningsData && inningsData.striker && !showNewBatterModal}
                    className="border p-2 rounded w-full mb-3 bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
                >
                    <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select Striker</option>
                    {battingPlayers.map((p) => (
                        <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={p._id} value={p._id}>
                            {p.name}
                        </option>
                    ))}
                </select>

                {/* NON STRIKER */}
                <label className="font-semibold">Non-Striker (Batter)</label>
                <select
                    value={nonStriker}
                    onChange={(e) => setNonStriker(e.target.value)}
                    disabled={inningsData && inningsData.nonStriker && !showNewBatterModal}
                    className="border p-2 rounded w-full mb-3 bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
                >
                    <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select Non-Striker</option>
                    {battingPlayers.map((p) => (
                        <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={p._id} value={p._id}>
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
                    disabled={overId && !needNewBowler}
                    className="border p-2 rounded w-full bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
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
                            className="border p-2 rounded bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
                        >
                            <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select Wicket Type</option>
                            <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="bowled">Bowled</option>
                            <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="caught">Caught</option>
                            <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="lbw">LBW</option>
                            <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="runout">Run Out</option>
                            <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="stumped">Stumped</option>
                            <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="hitwicket">Hit Wicket</option>
                        </select>

                        {wicketType === "runout" && (
                            <select
                                value={whichOut}
                                onChange={(e) => setWhichOut(e.target.value)}
                                className="border p-2 rounded ml-2 bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
                            >
                                <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="striker">Striker Out</option>
                                <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="nonStriker">Non-Striker Out</option>
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
                    <div className="mt-6">
                        <button
                            onClick={submitBall}
                            disabled={isBowlerBlocked}
                            className={`px-6 py-3 text-white rounded 
                ${isBowlerBlocked ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"}`}
                        >
                            Submit Ball
                        </button>
                    </div>
                </div>

                {/* Right column: quick actions & match info */}
                <div className="hidden lg:block">
                    <div className="sticky top-24 space-y-4">
                        <div className="bg-base-100 dark:bg-base-200 p-4 rounded shadow ring-1 ring-gray-200 dark:ring-gray-700 text-gray-900 dark:text-white">
                            <div className="text-sm text-gray-500">Over</div>
                            <div className="text-xl font-bold">{inningsData?.totalOvers || '0.0'}</div>
                            <div className="text-sm text-gray-500 mt-2">Last Bowler: {lastOverBowler ? (bowlingPlayers.find(p=>p._id===lastOverBowler)?.name || lastOverBowler) : '—'}</div>
                        </div>

                        <div className="bg-base-100 dark:bg-base-200 p-4 rounded shadow ring-1 ring-gray-200 dark:ring-gray-700 text-gray-900 dark:text-white">
                            <div className="text-sm text-gray-500">Quick Actions</div>
                            <div className="mt-3 flex flex-col gap-2">
                                <button onClick={() => { setRun(0); setExtra(null); setIsWicket(false);} } className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600">Set 0</button>
                                <button onClick={() => { setRun(4); setExtra(null); setIsWicket(false);} } className="px-3 py-2 bg-yellow-100 dark:bg-yellow-600 text-gray-900 dark:text-white rounded hover:brightness-95">4 Runs</button>
                                <button onClick={() => { setRun(6); setExtra(null); setIsWicket(false);} } className="px-3 py-2 bg-yellow-200 dark:bg-yellow-700 text-gray-900 dark:text-white rounded hover:brightness-95">6 Runs</button>
                                <button onClick={() => { setExtra('WD'); setRun(null); } } className="px-3 py-2 bg-orange-100 dark:bg-orange-600 text-gray-900 dark:text-white rounded hover:brightness-95">Wide</button>
                                <button onClick={() => { setIsWicket(true); setWicketType('caught'); } } className="px-3 py-2 bg-red-100 rounded">Wicket (Caught)</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --------------------------------------------------------
          MODAL: NEW BATTER
      ---------------------------------------------------------*/}
            {showNewBatterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-base-100 dark:bg-base-200 p-6 rounded shadow max-w-md w-full text-center">
                        <h3 className="text-lg font-semibold mb-3">New Batter Required</h3>
                        <p className="mb-3">
                            Select the incoming{" "}
                            <strong>{newBatterWhich === "striker" ? "striker" : "non-striker"}</strong>.
            </p>

                        <select
                            value={selectedNewBatter}
                            onChange={(e) => setSelectedNewBatter(e.target.value)}
                            className="border p-2 rounded w-full mb-4 bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
                        >
                            <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select Batter</option>
                            {battingPlayers.map((p) => (
                                <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" key={p._id} value={p._id}>
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
                    <div className="bg-base-100 dark:bg-base-200 p-6 rounded shadow max-w-md w-full text-center">
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
                            className="border p-2 rounded w-full mb-4 bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
                        >
                            <option className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white" value="">Select Bowler</option>
                            {bowlingPlayers.map((p) => (
                                <option
                                    className="bg-base-100 dark:bg-base-200 text-gray-900 dark:text-white"
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
