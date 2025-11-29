import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../utils/socket";
import { useDispatch, useSelector } from "react-redux";
import { setLiveScore } from "../../store/matchSlice";
import api from "../../services/api";

import LiveTimeline from "../../components/LiveTimeline";
import LiveCommentary from "../../components/LiveCommentary";

export default function LiveMatch() {
  const { matchId } = useParams();
  const dispatch = useDispatch();

  const liveScore = useSelector((state) => state.match.liveScore);

  const [balls, setBalls] = useState([]);
  const [commentary, setCommentary] = useState([]);

  useEffect(() => {
    socket.emit("joinMatch", matchId);

    socket.on("liveScoreUpdate", (data) => {
      dispatch(setLiveScore(data));
      fetchTimeline();
      fetchCommentary();
    });

    fetchTimeline();
    fetchCommentary();

    return () => {
      socket.off("liveScoreUpdate");
    };
  }, [matchId]);

  async function fetchTimeline() {
    const res = await api.get(`/balls/innings/${matchId}`);
    setBalls(res.data.balls);
  }

  async function fetchCommentary() {
    const res = await api.get(`/commentary/innings/${matchId}`);
    setCommentary(res.data.commentary);
  }

  if (!liveScore)
    return <div className="p-6">Waiting for live score...</div>;

  return (
    <div className="p-6 space-y-6">

      {/* SCOREBOARD */}
      <div className="bg-white p-5 rounded shadow">
        <h2 className="text-xl font-bold">Live Score</h2>
        <div className="text-lg mt-2">
          {liveScore.totalRuns}/{liveScore.totalWickets}
        </div>
        <div className="text-gray-600">
          Overs: {liveScore.currentOverBalls}/6
        </div>
      </div>

      {/* LAST BALL */}
      <div className="bg-white p-5 rounded shadow">
        <h3 className="font-semibold mb-2">Last Ball</h3>
        <div>Runs: {liveScore.lastBall.runs}</div>
        <div>Wicket: {liveScore.lastBall.isWicket ? "Yes" : "No"}</div>
      </div>

      {/* BALL BY BALL */}
      <div className="bg-white p-5 rounded shadow">
        <h3 className="text-lg font-bold mb-3">Ball-by-Ball Timeline</h3>
        <LiveTimeline balls={balls} />
      </div>

      {/* COMMENTARY */}
      <div className="bg-white p-5 rounded shadow">
        <h3 className="text-lg font-bold mb-3">Live Commentary</h3>
        <LiveCommentary commentary={commentary} />
      </div>

    </div>
  );
}

