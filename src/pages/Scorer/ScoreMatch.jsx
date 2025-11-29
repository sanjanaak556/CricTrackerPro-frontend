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

    const [run, setRun] = useState(null);
    const [extra, setExtra] = useState(null);
    const [isWicket, setIsWicket] = useState(false);
    const [comment, setComment] = useState("");

    const EXTRA_MAP = {
        NB: "noball",
        WD: "wide",
        BYE: "bye",
        LB: "legbye",
    };

    // --------------------------
    // INITIAL LOAD: INNINGS FIRST
    // --------------------------
    useEffect(() => {
        fetchInnings();
    }, [matchId]);

    // --------------------------
    // LOAD MATCH + PLAYERS
    // --------------------------
    useEffect(() => {
        loadMatch();
        fetchPlayers();

        socket.emit("joinMatch", matchId);
        socket.on("liveScoreUpdate", (data) => dispatch(setLiveScore(data)));

        return () => socket.off("liveScoreUpdate");
    }, [matchId]);

    // --------------------------
    // WHEN INNINGS AVAILABLE → FETCH ACTIVE OVER
    // --------------------------
    useEffect(() => {
        if (inningsData?._id) {
            fetchActiveOver();
        }
    }, [inningsData]);


    // ------------------------------------
    // API FUNCTIONS
    // ------------------------------------

    async function loadMatch() {
        try {
            const res = await api.get(`/matches/${matchId}`);
            setMatch(res);
        } catch (err) {
            console.log("Match load error:", err);
        }
    }

    async function fetchInnings() {
        try {
            const res = await api.get(`/innings/match/${matchId}`);
            setInningsData(res.innings);
        } catch (err) {
            console.log("Innings load error:", err);
        }
    }

    async function fetchPlayers() {
        try {
            const res = await api.get(`/matches/${matchId}/players`);
            setPlayersA(res.playersA || []);
            setPlayersB(res.playersB || []);
        } catch (err) {
            console.log("Player load error:", err);
        }
    }

    // -------------------------------
    // Determine batting & bowling team
    // -------------------------------
    function getBattingPlayers() {
        if (!inningsData || !match) return [];

        const teamAId = String(match.teamA._id || match.teamA);
        const batting = String(inningsData.battingTeam);

        return batting === teamAId ? playersA : playersB;
    }

    function getBowlingPlayers() {
        if (!inningsData || !match) return [];

        const teamAId = String(match.teamA._id || match.teamA);
        const bowling = String(inningsData.bowlingTeam);

        return bowling === teamAId ? playersA : playersB;
    }

    // -------------------------------
    // Get Active Over
    // -------------------------------
    async function fetchActiveOver() {
        if (!inningsData?._id) return;

        try {
            const res = await api.get(`/overs/active/${inningsData._id}`);
            if (res.activeOver) {
                setOverId(res.activeOver._id);
            } else {
                console.warn("No active over.");
            }
        } catch (err) {
            console.log("Active over load error:", err);
        }
    }

    // -------------------------------
    // START FIRST OVER
    // -------------------------------
    async function startFirstOver() {
        if (!bowler) {
            alert("Select a Bowler before starting over!");
            return;
        }

        try {
            const res = await api.post("/overs/start", {
                inningsId: inningsData._id,
                bowler
            });

            setOverId(res.over._id);
            alert("Over Started");
        } catch (err) {
            console.log("Start over error:", err);
        }
    }

    // -------------------------------
    // SUBMIT BALL
    // -------------------------------
    async function submitBall() {
        if (!overId) {
            alert("❌ No active over! Click Start Over first.");
            return;
        }

        if (run === null && !extra && !isWicket) {
            alert("Select Run OR Extra OR Wicket");
            return;
        }

        if (!striker || !nonStriker || !bowler) {
            alert("Select Striker, Non-Striker & Bowler");
            return;
        }

        const data = {
            matchId,
            inningsId: inningsData._id,
            overId,
            striker,
            nonStriker,
            bowler,
            runs: run || 0,
            extraType: extra ? EXTRA_MAP[extra] : "none",
            isWicket,
            comment
        };

        try {
            await api.post("/balls", data);

            setRun(null);
            setExtra(null);
            setIsWicket(false);
            setComment("");

            fetchInnings();
        } catch (err) {
            console.log("Ball submit error:", err);
        }
    }

    // -------------------------------
    // LOADING
    // -------------------------------
    if (!match || !inningsData)
        return <div className="p-6">Loading match...</div>;

    const battingPlayers = getBattingPlayers();
    const bowlingPlayers = getBowlingPlayers();

    // -------------------------------
    // UI
    // -------------------------------
    return (
        <div className="p-6">

            <h1 className="text-2xl font-bold mb-2">
                Scoring Panel — {match.matchName}
            </h1>

            <div className="mb-4 text-gray-600">
                <div>Innings: {inningsData.inningsNumber}</div>
                <div>Runs: {inningsData.totalRuns} / {inningsData.totalWickets}</div>
                <div>Overs: {inningsData.totalOvers}</div>
            </div>

            {/* START OVER BUTTON */}
            <button
                onClick={startFirstOver}
                className="px-4 py-2 bg-purple-600 text-white rounded mb-4"
            >
                Start Over
            </button>

            {/* PLAYER SELECTION */}
            <div className="bg-white p-4 rounded shadow mb-6">

                <label className="block font-semibold">Striker</label>
                <select
                    value={striker}
                    onChange={(e) => setStriker(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                >
                    <option value="">Select Striker</option>
                    {battingPlayers.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                </select>

                <label className="block font-semibold">Non-Striker</label>
                <select
                    value={nonStriker}
                    onChange={(e) => setNonStriker(e.target.value)}
                    className="border p-2 rounded w-full mb-3"
                >
                    <option value="">Select Non-Striker</option>
                    {battingPlayers.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                </select>

                <label className="block font-semibold">Bowler</label>
                <select
                    value={bowler}
                    onChange={(e) => setBowler(e.target.value)}
                    className="border p-2 rounded w-full"
                >
                    <option value="">Select Bowler</option>
                    {bowlingPlayers.map((p) => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                </select>

            </div>

            {/* RUN BUTTONS */}
            <h2 className="font-semibold mt-4">Runs</h2>
            <div className="flex gap-2 mt-2">
                {[0, 1, 2, 3, 4, 6].map((r) => (
                    <button
                        key={r}
                        onClick={() => setRun(r)}
                        className={`px-4 py-2 rounded border ${run === r ? "bg-blue-600 text-white" : "bg-white"}`}
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
                        className={`px-4 py-2 rounded border ${extra === ext ? "bg-yellow-500 text-black" : "bg-white"}`}
                    >
                        {ext}
                    </button>
                ))}
            </div>

            {/* WICKET */}
            <h2 className="font-semibold mt-4">Wicket</h2>
            <button
                onClick={() => setIsWicket(!isWicket)}
                className={`px-4 py-2 rounded border ${isWicket ? "bg-red-600 text-white" : "bg-white"}`}
            >
                OUT
            </button>

            {/* COMMENTARY */}
            <h2 className="font-semibold mt-4">Commentary</h2>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Optional commentary"
            />

            {/* SUBMIT BALL */}
            <button
                onClick={submitBall}
                className="mt-6 px-6 py-3 bg-green-600 text-white rounded"
            >
                Submit Ball
            </button>

        </div>
    );
}


