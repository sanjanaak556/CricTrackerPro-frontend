import { useEffect, useState } from "react";
import api from "../../services/api";

export default function FollowedTeams() {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchFollowed = async () => {
      try {
        const res = await api.get("/viewer/followed");
        setTeams(res || []);
      } catch (err) {
        console.error("Error loading followed teams", err);
      }
    };

    fetchFollowed();
  }, []);

  const handleUnfollow = async (teamId) => {
    try {
      await api.post("/viewer/unfollow", { teamId });

      // Remove from list immediately
      setTeams((prev) => prev.filter((t) => t._id !== teamId));

      // 🔥 Update teams page state via custom event
      window.dispatchEvent(
        new CustomEvent("team-unfollowed", { detail: { teamId } })
      );

    } catch (err) {
      console.error("Error unfollowing team", err);
    }
  };

  return (
    <div className="p-6 text-white space-y-6">
      
      {/* Heading with count */}
      <h1 className="text-3xl font-bold">
        Followed Teams
      </h1>

      <p className="text-gray-400">
        You are following <span className="font-semibold text-white">{teams.length}</span> team(s)
      </p>

      {teams.length === 0 ? (
        <p className="text-gray-400 text-lg">
          You are not following any team yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team._id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow hover:scale-[1.02] transition"
            >
              {/* Team Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-black">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="h-14 w-14 rounded object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold">{team.name}</h2>
              </div>

              {/* Team details */}
              <div className="text-gray-300 space-y-1 text-sm mb-4">
                <p>
                  <span className="text-gray-400">Captain:</span>{" "}
                  {team.captain || "N/A"}
                </p>
                <p>
                  <span className="text-gray-400">Players:</span>{" "}
                  {team.players?.length || 0}
                </p>
              </div>

              {/* Unfollow Button */}
              <button
                onClick={() => handleUnfollow(team._id)}
                className="mt-3 w-full py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg"
              >
                Unfollow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
