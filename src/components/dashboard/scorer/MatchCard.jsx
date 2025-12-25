import { useNavigate } from "react-router-dom";

export default function MatchCard({ match }) {
  const navigate = useNavigate();

  /* ---------- STATUS BADGE ---------- */
  const getStatusBadge = (status) => {
    const base =
      "inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full";

    switch (status) {
      case "live":
        return `${base} bg-red-600 text-white`;
      case "completed":
        return `${base} bg-green-100 text-green-700`;
      case "upcoming":
        return `${base} bg-blue-100 text-blue-700`;
      case "postponed":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "abandoned":
        return `${base} bg-gray-200 text-gray-700`;
      default:
        return `${base} bg-gray-200 text-gray-700`;
    }
  };

  /* ---------- BUTTON STYLE ---------- */
  const getButtonStyle = (status) => {
  switch (status) {
    case "live":
      return "bg-red-600 hover:bg-red-700 cursor-pointer";
    case "upcoming":
      return "bg-blue-600 hover:bg-blue-700 cursor-pointer";
    case "completed":
      return "bg-green-600 hover:bg-green-700 cursor-pointer";
    default:
      return "bg-gray-500 hover:bg-gray-600 cursor-pointer";
  }
};

  const getActionLabel = () => {
  switch (match.status) {
    case "upcoming":
      return "Start Scoring";
    case "live":
      return "Continue Scoring";
    case "completed":
      return "View Scoreboard";
    case "abandoned":
    case "postponed":
      return "View Details";
    default:
      return "Unavailable";
  }
};

  const handleAction = () => {
  switch (match.status) {
    case "upcoming":
      navigate(`/scorer/${match._id}/start`);
      break;

    case "live":
      navigate(`/scorer/${match._id}/score`);
      break;

    case "completed":
      navigate(`/scorer/scoreboard/${match._id}`);
      break;

    case "abandoned":
    case "postponed":
      navigate(`/scorer/match/${match._id}`);
      break;

    default:
      alert("Action not available");
  }
};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
      {/* ---------- TOP ROW : STATUS ---------- */}
      <div className="flex justify-end mb-3">
        <span className={getStatusBadge(match.status)}>
          {match.status === "live" && (
            <span className="w-2 h-2 bg-white rounded-full animate-ping" />
          )}
          {match.status.toUpperCase()}
        </span>
      </div>

      {/* ---------- TEAMS ROW ---------- */}
      <div className="flex items-center justify-between mb-4">
        {/* Team A */}
        <div className="flex items-center gap-2">
          {match.teamA?.logo && (
            <img
              src={match.teamA.logo}
              alt={match.teamA.name}
              className="w-11 h-11 rounded-full object-cover border"
            />
          )}
          <span className="font-semibold text-gray-900 dark:text-white">
            {match.teamA?.name}
          </span>
        </div>

        <span className="text-sm font-medium text-gray-400">VS</span>

        {/* Team B */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-white">
            {match.teamB?.name}
          </span>
          {match.teamB?.logo && (
            <img
              src={match.teamB.logo}
              alt={match.teamB.name}
              className="w-11 h-11 rounded-full object-cover border"
            />
          )}
        </div>
      </div>

      {/* ---------- MATCH INFO ---------- */}
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>
          <span className="font-medium">Match Type:</span> {match.matchType}
        </p>
        <p>
          <span className="font-medium">Venue:</span>{" "}
          {match.venue?.name}
          {match.venue?.city && `, ${match.venue.city}`}
        </p>
      </div>

      {/* ---------- ACTION BUTTON ---------- */}
      <button
        onClick={handleAction}
        className={`mt-5 w-full text-white font-semibold py-2 rounded-lg transition ${getButtonStyle(
          match.status
        )}`}
      >
        {getActionLabel()}
      </button>
    </div>
  );
}
