import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../services/api";
import { setActiveMatch } from "../../store/matchSlice";
import { useNavigate } from "react-router-dom";

export default function ScorerDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { activeMatch } = useSelector((state) => state.match);

  useEffect(() => {
    fetchAssignedMatch();
  }, []);

  async function fetchAssignedMatch() {
    try {
      const res = await api.get("/matches/scorer/active");
      console.log("API RESPONSE:", res);
      dispatch(setActiveMatch(res.match));

    } catch (err) {
      console.log("ERROR RESPONSE:", err?.response?.data || err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Scorer Dashboard</h1>

      {!activeMatch && (
        <p className="text-gray-500">No match assigned by admin.</p>
      )}

      {activeMatch && (
        <div className="bg-white shadow p-4 rounded">
          <h2 className="text-xl font-semibold">
            {activeMatch.teamA.name} vs {activeMatch.teamB.name}
          </h2>

          <button
            onClick={() => navigate(`/scorer/score/${activeMatch._id}`)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            Start Scoring
          </button>
        </div>
      )}
    </div>
  );
}

  