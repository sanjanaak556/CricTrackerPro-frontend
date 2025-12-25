import { useEffect, useState } from "react";
import { Users2, Search, ArrowLeft } from "lucide-react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [following, setFollowing] = useState([]); //  store followed teams

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // Get all teams
        const teamRes = await api.get("/teams");

        // handle both old & new backend responses
        const teamsArray =
          Array.isArray(teamRes)
            ? teamRes
            : teamRes?.teams || teamRes?.data || [];

        setTeams(teamsArray);

        // Get followed teams
        const followedRes = await api.get("/viewer/followed");

        // Convert objects → IDs
        const followedIds = (followedRes || []).map((t) => t._id);
        setFollowing(followedIds);
      } catch (err) {
        console.error("Error fetching", err);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const onUnfollow = (e) => {
      const { teamId } = e.detail;
      setFollowing((prev) => prev.filter((id) => id !== teamId));
    };

    window.addEventListener("team-unfollowed", onUnfollow);

    return () => window.removeEventListener("team-unfollowed", onUnfollow);
  }, []);

  const handleFollow = async (teamId) => {
    try {
      await api.post("/viewer/follow", { teamId });

      // update state instantly
      setFollowing((prev) => [...prev, teamId]);
    } catch (err) {
      console.error("Error following team", err);
    }
  };

  const handleUnfollow = async (teamId) => {
    try {
      await api.post("/viewer/unfollow", { teamId });

      setFollowing((prev) => prev.filter((id) => id !== teamId));
    } catch (err) {
      console.error("Error unfollowing team", err);
    }
  };

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white space-y-6">
      {/* Back */}
      <Link
        to="/viewer/dashboard"
        className="inline-flex items-center text-blue-600 hover:text-blue-400"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold">Teams</h1>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
        />
      </div>

      {/* Teams Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((team) => {
          const isFollowing = following.includes(team._id);

          return (
            <div
              key={team._id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700 shadow hover:scale-[1.02] transition"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-black">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold">{team.name}</h2>
              </div>

              <div className="text-gray-300 space-y-1 text-sm mb-4">
                <p>
                  <span className="text-gray-400">Captain:</span>{" "}
                  {team.captain || "N/A"}
                </p>
                <p>
                  <span className="text-gray-400">Players:</span>{" "}
                  {team.playerCount ?? 0}
                </p>
              </div>

              {/* Follow / Unfollow Buttons */}
              <div className="flex gap-3">
                {/* Follow Button */}
                <button
                  onClick={() => handleFollow(team._id)}
                  disabled={isFollowing}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition
                    ${isFollowing
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>

                {/* Unfollow Button */}
                <button
                  onClick={() => handleUnfollow(team._id)}
                  disabled={!isFollowing}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition
                    ${!isFollowing
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                    }`}
                >
                  Unfollow
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
